// frontend/components/AdminSupportChat.jsx
import { useEffect, useState, useRef } from 'react';
import { io } from 'socket.io-client';
import API from '../api/axios';

const socket = io('http://localhost:5000');

export default function AdminSupportChat({ adminId }) {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const bottomRef = useRef(null);

  // Fetch all conversations
  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await API.get('/v1/chats/admin/support');
        setConversations(data.conversations);
      } catch (err) {
        console.error('❌ Error fetching conversations:', err.response?.data || err.message);
      }
    };
    fetchConversations();
  }, []);

  // Open a conversation
  const openConversation = async (conversation) => {
    setSelectedConversation(conversation);
    socket.emit('joinRoom', conversation._id);

    try {
      const { data } = await API.get(`/v1/chats/messages/${conversation._id}`);
      setMessages(data.messages);
    } catch (err) {
      console.error('❌ Error fetching messages:', err.response?.data || err.message);
    }
  };

  // Listen for incoming messages
  useEffect(() => {
    const handleMessage = (message) => {
      if (message.conversationId === selectedConversation?._id) {
        setMessages((prev) => [...prev, message]);
      }
    };

    socket.on('messageReceived', handleMessage);
    return () => socket.off('messageReceived', handleMessage);
  }, [selectedConversation]);

  // Auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!newMessage.trim() || !selectedConversation) return;

    try {
      await API.post('/v1/chats/message', {
        conversationId: selectedConversation._id,
        content: newMessage,
      });

      setNewMessage('');
    } catch (err) {
      console.error('❌ Error sending message:', err.response?.data || err.message);
    }
  };

  return (
    <div className="flex h-[90vh] border rounded-lg shadow-lg bg-white overflow-hidden">
      {/* Sidebar (Conversations) */}
      <div
        className={`${
          selectedConversation ? 'hidden md:block' : 'block'
        } w-full md:w-1/3 border-r bg-gray-50`}
      >
        <h2 className="p-4 font-bold text-lg border-b bg-green-600 text-white">Support Chats</h2>
        {conversations.length > 0 ? (
          conversations.map((c) => (
            <div
              key={c._id}
              className={`p-4 cursor-pointer hover:bg-green-100 ${
                selectedConversation?._id === c._id ? 'bg-green-200' : ''
              }`}
              onClick={() => openConversation(c)}
            >
              <p className="font-semibold text-gray-700">
                {c.members
                  .filter((m) => m._id !== adminId)
                  .map((m) => `${m.firstName} ${m.lastName}`)
                  .join(', ')}
              </p>
              <p className="text-xs text-gray-500 truncate">{c.lastMessage || 'No messages yet'}</p>
            </div>
          ))
        ) : (
          <p className="p-4 text-gray-500">No support conversations yet.</p>
        )}
      </div>

      {/* Chat window */}
      <div
        className={`${selectedConversation ? 'flex' : 'hidden'} md:flex w-full md:w-2/3 flex-col`}
      >
        {selectedConversation ? (
          <>
            {/* Chat header */}
            <div className="p-4 bg-green-600 text-white font-semibold flex items-center">
              {/* Back button (mobile only) */}
              <button
                className="mr-3 md:hidden bg-green-700 px-2 py-1 rounded text-sm"
                onClick={() => setSelectedConversation(null)}
              >
                ← Back
              </button>
              Chat with{' '}
              {selectedConversation.members
                .filter((m) => m._id !== adminId)
                .map((m) => `${m.firstName} ${m.lastName}`)
                .join(', ')}
            </div>

            {/* Messages */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
              {messages.length > 0 ? (
                messages.map((msg) => (
                  <div
                    key={msg._id}
                    className={`max-w-[70%] mb-2 p-2 rounded-lg text-sm relative ${
                      msg.senderId === adminId
                        ? 'ml-auto bg-green-500 text-white rounded-br-none'
                        : 'mr-auto bg-white text-gray-800 border rounded-bl-none'
                    }`}
                  >
                    <div>{msg.content}</div>
                    {msg.senderId === adminId && (
                      <div className="text-[10px] mt-1 text-right text-gray-200">
                        {msg.seen ? 'Seen' : 'Sent'}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <p className="text-gray-500 text-center">
                  No messages yet. Start the conversation!
                </p>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input box */}
            <div className="p-3 border-t flex items-center bg-white">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a reply..."
                className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
                onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
              />
              <button
                onClick={sendMessage}
                className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex-1 hidden md:flex items-center justify-center text-gray-500">
            Select a conversation to start chatting
          </div>
        )}
      </div>
    </div>
  );
}

// // frontend/components/AdminSupportChat.jsx
// import { useEffect, useState, useRef } from 'react';
// import { io } from 'socket.io-client';
// import API from '../api/axios'; // adjust path if needed

// const socket = io('http://localhost:5000');

// export default function AdminSupportChat({ adminId }) {
//   const [conversations, setConversations] = useState([]);
//   const [selectedConversation, setSelectedConversation] = useState(null);
//   const [messages, setMessages] = useState([]);
//   const [newMessage, setNewMessage] = useState('');
//   const bottomRef = useRef(null);

//   // Fetch all conversations
//   useEffect(() => {
//     const fetchConversations = async () => {
//       try {
//         const { data } = await API.get('/v1/chats/admin/support');
//         setConversations(data.conversations);
//       } catch (err) {
//         console.error('❌ Error fetching conversations:', err.response?.data || err.message);
//       }
//     };
//     fetchConversations();
//   }, []);

//   // Open a conversation
//   const openConversation = async (conversation) => {
//     setSelectedConversation(conversation);
//     socket.emit('joinRoom', conversation._id);

//     try {
//       const { data } = await API.get(`/v1/chats/messages/${conversation._id}`);
//       setMessages(data.messages);
//     } catch (err) {
//       console.error('❌ Error fetching messages:', err.response?.data || err.message);
//     }
//   };

//   // Listen for incoming messages
//   useEffect(() => {
//     const handleMessage = (message) => {
//       if (message.conversationId === selectedConversation?._id) {
//         setMessages((prev) => [...prev, message]);
//       }
//     };

//     socket.on('messageReceived', handleMessage);
//     return () => socket.off('messageReceived', handleMessage);
//   }, [selectedConversation]);

//   // Auto-scroll to bottom
//   useEffect(() => {
//     bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   // Send message
//   const sendMessage = async () => {
//     if (!newMessage.trim() || !selectedConversation) return;

//     try {
//       await API.post('/v1/chats/message', {
//         conversationId: selectedConversation._id,
//         content: newMessage,
//       });

//       setNewMessage('');
//     } catch (err) {
//       console.error('❌ Error sending message:', err.response?.data || err.message);
//     }
//   };

//   return (
//     <div className="flex h-[90vh] border rounded-lg shadow-lg bg-white overflow-hidden">
//       {/* Sidebar */}
//       <div className="w-1/3 border-r bg-gray-50">
//         <h2 className="p-4 font-bold text-lg border-b bg-green-600 text-white">Support Chats</h2>
//         {conversations.length > 0 ? (
//           conversations.map((c) => (
//             <div
//               key={c._id}
//               className={`p-4 cursor-pointer hover:bg-green-100 ${
//                 selectedConversation?._id === c._id ? 'bg-green-200' : ''
//               }`}
//               onClick={() => openConversation(c)}
//             >
//               <p className="font-semibold text-gray-700">
//                 {c.members
//                   .filter((m) => m._id !== adminId) // exclude admin
//                   .map((m) => `${m.firstName} ${m.lastName}`)
//                   .join(', ')}
//                 {console.log(c)}
//               </p>
//             </div>
//           ))
//         ) : (
//           <p className="p-4 text-gray-500">No support conversations yet.</p>
//         )}
//       </div>

//       {/* Chat window */}
//       {selectedConversation ? (
//         <div className="w-2/3 flex flex-col">
//           {/* Chat header */}
//           <div className="p-4 bg-green-600 text-white font-semibold">
//             Chat with{' '}
//             {selectedConversation.members
//               .filter((m) => m._id !== adminId)
//               .map((m) => `${m.firstName} ${m.lastName}`)
//               .join(', ')}
//           </div>

//           {/* Messages */}
//           <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
//             {messages.length > 0 ? (
//               messages.map((msg) => (
//                 <div
//                   key={msg._id}
//                   className={`max-w-[70%] mb-2 p-2 rounded-lg text-sm relative ${
//                     msg.senderId === adminId
//                       ? 'ml-auto bg-green-500 text-white rounded-br-none' // ✅ admin
//                       : 'mr-auto bg-white text-gray-800 border rounded-bl-none' // ✅ user
//                   }`}
//                 >
//                   <div>{msg.content}</div>

//                   {/* Seen / Sent status for admin’s own messages */}
//                   {msg.senderId === adminId && (
//                     <div className="text-[10px] mt-1 text-right text-gray-200">
//                       {msg.seen ? 'Seen' : 'Sent'}
//                     </div>
//                   )}
//                 </div>
//               ))
//             ) : (
//               <p className="text-gray-500 text-center">No messages yet. Start the conversation!</p>
//             )}
//             <div ref={bottomRef} />
//           </div>

//           {/* Input box */}
//           <div className="p-3 border-t flex items-center bg-white">
//             <input
//               type="text"
//               value={newMessage}
//               onChange={(e) => setNewMessage(e.target.value)}
//               placeholder="Type a reply..."
//               className="flex-1 px-3 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-green-400"
//               onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
//             />
//             <button
//               onClick={sendMessage}
//               className="ml-2 px-4 py-2 bg-green-600 text-white rounded-full hover:bg-green-700"
//             >
//               Send
//             </button>
//           </div>
//         </div>
//       ) : (
//         <div className="w-2/3 flex items-center justify-center text-gray-500">
//           Select a conversation to start chatting
//         </div>
//       )}
//     </div>
//   );
// }
