// Server/socket-handlers/codeSocket.js - PRODUCTION HOTFIX
const CodeSession = require('../models/CodeSessionModel');

const handleCodeCollaboration = (io) => {
  console.log("Setting up optimized code collaboration handlers...");

  const codeNamespace = io.of("/code");
  
  // Memory cache for active sessions (performance boost)
  const sessionCache = new Map();
  const codeUpdateQueue = new Map(); // Debounce database writes

  codeNamespace.on("connection", (socket) => {
    console.log(`Code user connected: ${socket.id}`);

    socket.on("join-code-session", async (data) => {
      const { sessionId, user } = data;
      const userId = (user._id || user.id)?.toString();
      
      // Extract the session name (everything before the timestamp/unique ID)
      const sessionName = sessionId.split('_')[0].trim().toLowerCase();
      const timestamp = sessionId.split('_')[1] || '';
      
      console.log(`User ${userId} joining session with name: ${sessionName}`);

      try {
        // First try to find an active session with the same name
        let existingSessions = [];
        
        // Check cache first
        for (const [cachedId, cachedSession] of sessionCache.entries()) {
          if (cachedId.split('_')[0].toLowerCase() === sessionName) {
            existingSessions.push(cachedSession);
          }
        }
        
        // If not in cache, check database
        if (existingSessions.length === 0) {
          existingSessions = await CodeSession.find({
            sessionId: { 
              $regex: new RegExp(`^${sessionName}_`, 'i') 
            }
          }).sort({ createdAt: -1 }); // Get most recent first
        }
        
        let session;
        if (existingSessions.length > 0) {
          // Use the most recently created session
          session = existingSessions[0];
          console.log(`Joining existing session: ${session.sessionId}`);
        } else {
          // If no session exists, use the current sessionId
          session = await CodeSession.findOne({ sessionId });
          
          if (!session) {
            socket.emit("error", { message: "Session not found" });
            return;
          }
          // Always store with normalized ID in cache
          session.sessionId = normalizedSessionId;
          sessionCache.set(normalizedSessionId, session);
        }

        // Check if user is already in the session with a different socket
        const existingSocket = await codeNamespace.in(sessionId).fetchSockets()
          .then(sockets => sockets.find(s => s.userId === userId && s.id !== socket.id));

        if (existingSocket) {
          // Disconnect the old socket
          console.log(`Disconnecting old socket ${existingSocket.id} for user ${userId}`);
          existingSocket.disconnect(true);
        }

        // Leave any previous rooms
        Array.from(socket.rooms).forEach((room) => {
          if (room !== socket.id) {
            socket.leave(room);
          }
        });

        // Join using the session's actual ID
        const activeSessionId = session.sessionId;
        await socket.join(activeSessionId);
        socket.userId = userId;
        socket.sessionId = activeSessionId;
        socket.userInfo = user;

        // Generate user color
        const colors = ["#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7", "#DDA0DD", "#98D8C8", "#F7DC6F"];
        const usedColors = session.participants.map(p => p.color);
        const userColor = colors.find(color => !usedColors.includes(color)) || 
                         colors[Math.floor(Math.random() * colors.length)];

        // Add/update participant
        const participantData = {
          userId,
          username: user.firstName || user.username || "Anonymous",
          color: userColor,
          cursor: { line: 1, column: 1 },
          socketId: socket.id,
          lastActive: new Date(),
        };

        const existingIndex = session.participants.findIndex(p => p.userId?.toString() === userId);
        if (existingIndex >= 0) {
          session.participants[existingIndex] = participantData;
        } else {
          session.participants.push(participantData);
        }

        // Update cache immediately
        sessionCache.set(sessionId, session);

        // Save to database (async, non-blocking)
        setImmediate(async () => {
          try {
            await session.save();
          } catch (err) {
            console.error('Error saving session:', err);
          }
        });

        // Send current session data to joining user
        socket.emit("session-joined", {
          sessionId: session.sessionId,
          code: session.code,
          language: session.language,
          participants: session.participants.map(p => ({
            userId: p.userId,
            username: p.username,
            color: p.color,
            cursor: p.cursor,
          })),
        });

        // Notify other users
        socket.to(sessionId).emit("user-joined", participantData);

        // Broadcast updated participants list
        const currentParticipants = session.participants.map(p => ({
          userId: p.userId,
          username: p.username,
          color: p.color,
          cursor: p.cursor,
        }));

        codeNamespace.to(sessionId).emit("participants-update", currentParticipants);
        console.log(`Participants update sent for session ${sessionId}`);

      } catch (error) {
        console.error("Error joining code session:", error);
        socket.emit("error", { message: "Failed to join session" });
      }
    });

    // CRITICAL FIX: Immediate broadcast for code changes
    socket.on("code-change", async (data) => {
      const { sessionId, code, changes, userId, timestamp } = data;

      console.log(`Code change from user ${userId} in session ${sessionId}`);

      if (socket.sessionId !== sessionId) {
        console.log(`Invalid session access attempt`);
        return;
      }

      try {
        // STEP 1: Update cache immediately
        const session = sessionCache.get(sessionId);
        if (session) {
          session.code = code;
          session.lastModified = new Date();
          sessionCache.set(sessionId, session);
        }

        // STEP 2: Broadcast to other users IMMEDIATELY (most critical fix)
        const updateData = {
          sessionId,
          code,
          changes,
          userId: socket.userId,
          timestamp: timestamp || Date.now(),
        };

        socket.to(sessionId).emit("code-update", updateData);
        console.log(`Broadcasted code update to session ${sessionId}`);

        // STEP 3: Database update (debounced to reduce load)
        clearTimeout(codeUpdateQueue.get(sessionId));
        codeUpdateQueue.set(sessionId, setTimeout(async () => {
          try {
            await CodeSession.updateOne(
              { sessionId },
              { 
                $set: { code, lastModified: new Date() },
                $inc: { "stats.totalEdits": 1 }
              }
            );
            console.log(`Database updated for session ${sessionId}`);
          } catch (error) {
            console.error('Database update error:', error);
          }
        }, 300)); // 300ms debounce

      } catch (error) {
        console.error("Code change error:", error);
        socket.emit("error", { message: "Failed to update code" });
      }
    });

    // Optimized cursor movement
    socket.on("cursor-move", async (data) => {
      const { sessionId, position } = data;

      if (socket.sessionId !== sessionId) return;

      try {
        // Update cache
        const session = sessionCache.get(sessionId);
        if (session) {
          const participant = session.participants.find(p => p.userId === socket.userId);
          if (participant) {
            participant.cursor = position;
            participant.lastActive = new Date();
          }
        }

        // Broadcast immediately
        socket.to(sessionId).emit("cursor-update", {
          userId: socket.userId,
          position,
          timestamp: Date.now(),
        });

        // Database update (non-blocking)
        setImmediate(async () => {
          await CodeSession.updateOne(
            { sessionId, "participants.userId": socket.userId },
            { 
              $set: { 
                "participants.$.cursor": position,
                "participants.$.lastActive": new Date()
              }
            }
          ).catch(err => console.error('Cursor update error:', err));
        });

      } catch (error) {
        console.error("Cursor move error:", error);
      }
    });

    // Typing indicators
    socket.on("typing-start", (data) => {
      const { sessionId } = data;
      if (socket.sessionId === sessionId) {
        socket.to(sessionId).emit("user-typing", {
          userId: socket.userId,
          isTyping: true,
        });
      }
    });

    socket.on("typing-stop", (data) => {
      const { sessionId } = data;
      if (socket.sessionId === sessionId) {
        socket.to(sessionId).emit("user-typing", {
          userId: socket.userId,
          isTyping: false,
        });
      }
    });

    // Language change
    socket.on("language-change", async (data) => {
      const { sessionId, language } = data;

      if (socket.sessionId !== sessionId) return;

      try {
        // Update cache
        const session = sessionCache.get(sessionId);
        if (session) {
          session.language = language;
          sessionCache.set(sessionId, session);
        }

        // Broadcast immediately
        socket.to(sessionId).emit("language-update", {
          language,
          userId: socket.userId,
        });

        // Database update (non-blocking)
        setImmediate(async () => {
          await CodeSession.updateOne(
            { sessionId },
            { $set: { language, lastModified: new Date() } }
          ).catch(err => console.error('Language update error:', err));
        });

      } catch (error) {
        console.error("Language change error:", error);
      }
    });

    // Disconnect handler
    socket.on("disconnect", async (reason) => {
      console.log(`Code user disconnected: ${socket.id}, reason: ${reason}`);

      if (socket.userId && socket.sessionId) {
        try {
          // Check if user has another active socket in the same session
          const activeSockets = await codeNamespace.in(socket.sessionId).fetchSockets();
          const hasAnotherSocket = activeSockets.some(s => 
            s.userId === socket.userId && s.id !== socket.id
          );

          // Only remove participant if this was their last socket
          if (!hasAnotherSocket) {
            // Update cache
            const session = sessionCache.get(socket.sessionId);
            if (session) {
              session.participants = session.participants.filter(p => p.userId !== socket.userId);
              
              if (session.participants.length === 0) {
                sessionCache.delete(socket.sessionId);
              } else {
                sessionCache.set(socket.sessionId, session);

                // Send updated participants list
                const currentParticipants = session.participants.map(p => ({
                  userId: p.userId,
                  username: p.username,
                  color: p.color,
                  cursor: p.cursor,
                }));

                codeNamespace.to(socket.sessionId).emit("participants-update", currentParticipants);
              }
            }
            
            // Notify others only if this was the user's last socket
            socket.to(socket.sessionId).emit("user-left", { 
              userId: socket.userId 
            });

            // Update database (non-blocking)
            setImmediate(async () => {
              await CodeSession.updateOne(
                { sessionId: socket.sessionId },
                { $pull: { participants: { userId: socket.userId } } }
              ).catch(err => console.error('Disconnect cleanup error:', err));
            });
          }
        } catch (error) {
          console.error("Disconnect cleanup error:", error);
        }
      }
    });

    // Health check
    socket.on("ping", () => {
      socket.emit("pong", { timestamp: Date.now() });
    });
  });

  // Cleanup inactive sessions every 10 minutes
  setInterval(async () => {
    try {
      // Clean memory cache
      for (const [sessionId, session] of sessionCache.entries()) {
        if (!session.participants || session.participants.length === 0) {
          sessionCache.delete(sessionId);
        }
      }
      
      console.log(`Active sessions in cache: ${sessionCache.size}`);
    } catch (error) {
      console.error('Cache cleanup error:', error);
    }
  }, 10 * 60 * 1000);

  console.log("Optimized code collaboration handlers initialized");
  return codeNamespace;
};

module.exports = handleCodeCollaboration;