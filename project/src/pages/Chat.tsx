import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store';
import { fetchMessages, sendMessage } from '../store/slices/chatSlice';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';
import axios from 'axios';

function Chat() {
  const dispatch = useDispatch<AppDispatch>();
  const { user: currentUser } = useAuth();
  const { messages, activeChat, loading } = useSelector((state: RootState) => state.chat);
  const [contacts, setContacts] = useState<User[]>([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await axios.get('/api/users/contacts');
        setContacts(response.data);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
      }
    };

    fetchContacts();
  }, []);

  useEffect(() => {
    if (activeChat) {
      dispatch(fetchMessages(activeChat));
    }
  }, [activeChat, dispatch]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMessage.trim() && activeChat) {
      dispatch(sendMessage({ content: newMessage, receiverId: activeChat }));
      setNewMessage('');
    }
  };

  return (
    <div className="h-[calc(100vh-4rem)] flex">
      {/* Contacts Sidebar */}
      <div className="w-1/4 bg-white border-r">
        <div className="p-4">
          <h2 className="text-lg font-semibold mb-4">Contacts</h2>
          <div className="space-y-2">
            {contacts.map((contact) => (
              <button
                key={contact.id}
                className={`w-full text-left p-3 rounded-lg hover:bg-gray-100 ${
                  activeChat === contact.id ? 'bg-gray-100' : ''
                }`}
                onClick={() => dispatch({ type: 'chat/setActiveChat', payload: contact.id })}
              >
                <div className="flex items-center space-x-3">
                  <img
                    src={contact.avatar || `https://ui-avatars.com/api/?name=${contact.username}`}
                    alt={contact.username}
                    className="w-10 h-10 rounded-full"
                  />
                  <span>{contact.username}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {activeChat ? (
          <>
            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto">
              {loading ? (
                <div className="flex justify-center items-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              ) : (
                <div className="space-y-4">
                  {messages.map((message) => (
                    <div
                      key={message.id}
                      className={`flex ${
                        message.senderId === currentUser?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs px-4 py-2 rounded-lg ${
                          message.senderId === currentUser?.id
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-100'
                        }`}
                      >
                        {message.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Message Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 rounded-lg border-gray-300 focus:ring-blue-500 focus:border-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
                >
                  Send
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a contact to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;