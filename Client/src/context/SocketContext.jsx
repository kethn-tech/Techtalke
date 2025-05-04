import {createContext, useContext, useEffect, useRef} from 'react';
import {useStore} from '@/store/store.js'
import {io} from 'socket.io-client'
import { toast } from "sonner";

const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const socket = useRef(null);
  const { userInfo, addMessage } = useStore();

  useEffect(() => {
    if (userInfo) {
      socket.current = io("http://localhost:4000", {
        withCredentials: true,
        query: {
          userId: userInfo._id,
        },
      });

      socket.current.on("connect", () => {
        console.log("Connected to socket server");
      });

      const handleReceiveMessage = (message) => {
        try {
          const { selectedChatType, selectedChatData } = useStore.getState();
          if (
            selectedChatType !== undefined &&
            selectedChatData &&
            (selectedChatData._id === message.sender._id ||
              selectedChatData._id === message.recipient._id)
          ) {
            console.log("Received message: ", message);
            addMessage(message);
          } else {
            // Show notification if not currently viewing the chat
            const senderName = message.sender.firstName
              ? `${message.sender.firstName} ${
                  message.sender.lastName || ""
                }`.trim()
              : "Someone";
            let notificationMsg = "New message received";
            if (message.messageType === "text") {
              notificationMsg = `${senderName}: ${message.content}`;
            } else if (message.messageType === "file") {
              notificationMsg = `${senderName} sent a file.`;
            } else if (message.messageType === "code") {
              notificationMsg = `${senderName} sent code.`;
            }
            toast.info(notificationMsg, { duration: 3000 });
          }
        } catch (error) {
          console.error("Error handling received message:", error);
        }
      };

      socket.current.on("receiveMessage", handleReceiveMessage);

      return () => {
        if (socket.current) {
          socket.current.disconnect();
        }
      };
    }
  }, [userInfo]);

  return (
    <SocketContext.Provider value={socket.current}>
      {children}
    </SocketContext.Provider>
  );
};