// Create this as a test file: Client/src/debug/socket-test.js
// Run this in your browser console to test socket connection

const testCodeCollaboration = () => {
  console.log('🧪 Starting Code Collaboration Socket Test...');
  
  // Test socket connection
  const socket = io('http://localhost:4000', {
    transports: ['polling', 'websocket'],
    upgrade: true,
    timeout: 10000
  });

  socket.on('connect', () => {
    console.log('✅ Socket connected successfully!');
    console.log('📡 Socket ID:', socket.id);
    
    // Test joining a session
    const testSessionId = 'test-session-123';
    const testUser = {
      _id: 'test-user-123',
      firstName: 'Test User'
    };
    
    console.log('🎯 Testing session join...');
    socket.emit('join-code-session', {
      sessionId: testSessionId,
      user: testUser
    });
    
    // Test code change after 2 seconds
    setTimeout(() => {
      console.log('📝 Testing code change...');
      socket.emit('code-change', {
        sessionId: testSessionId,
        code: '// Test code change\nconsole.log("Hello from test!");',
        userId: testUser._id,
        timestamp: Date.now()
      });
    }, 2000);
  });

  socket.on('connect_error', (error) => {
    console.error('❌ Connection failed:', error);
  });

  socket.on('session-joined', (data) => {
    console.log('🎯 Session joined successfully:', data);
  });

  socket.on('code-update', (data) => {
    console.log('📝 Received code update:', data);
  });

  socket.on('participants-update', (participants) => {
    console.log('👥 Participants updated:', participants);
  });

  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });

  // Return socket for manual testing
  window.testSocket = socket;
  console.log('🔧 Socket available as window.testSocket for manual testing');
  
  return socket;
};

// Auto-run test
// testCodeCollaboration();

// Manual test functions
window.debugCodeCollab = {
  test: testCodeCollaboration,
  
  // Test code change
  sendCodeChange: (code = '// Manual test\nconsole.log("Manual test");') => {
    if (window.testSocket) {
      window.testSocket.emit('code-change', {
        sessionId: 'test-session-123',
        code: code,
        userId: 'test-user-123',
        timestamp: Date.now()
      });
    }
  },
  
  // Check connection status
  checkStatus: () => {
    if (window.testSocket) {
      console.log('Socket connected:', window.testSocket.connected);
      console.log('Socket ID:', window.testSocket.id);
    } else {
      console.log('No test socket available');
    }
  }
};

console.log('🧪 Code Collaboration Debug Tools loaded!');
console.log('📋 Available commands:');
console.log('  window.debugCodeCollab.test() - Run full test');
console.log('  window.debugCodeCollab.sendCodeChange() - Send test code');
console.log('  window.debugCodeCollab.checkStatus() - Check connection');