export const createChatSlice = (set, get) => ({
  selectedChatType: undefined,
  selectedChatMessages: [],
  selectedChatData: undefined,
  dmContacts: [],
  groupChats: [],

  setSelectedChatType: (selectedChatType) => set({ selectedChatType }),
  setSelectedChatMessages: (selectedChatMessages) => set({ selectedChatMessages }),
  setSelectedChatData: (selectedChatData) => set({ selectedChatData }),
  setDmContacts: (dmContacts) => set({ dmContacts }),
  setGroupChats: (groupChats) => set({ groupChats }),

  closeChat: () => {
    set({
      selectedChatType: undefined,
      selectedChatMessages: [],
      selectedChatData: undefined,
    });
  },

  addMessage: (message) => {
    const selectedChatMessages = get().selectedChatMessages;
    const selectedChatType = get().selectedChatType;

    set({
      selectedChatMessages: [
        ...selectedChatMessages,
        {
          ...message,
          recipient: selectedChatType === "group" ? message.recipient : message.recipient,
          sender: selectedChatType === "group" ? message.sender : message.sender,
        },
      ],
    });
  },
});