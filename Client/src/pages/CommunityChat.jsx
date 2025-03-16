import { useState, useEffect } from "react";
import { io } from "socket.io-client";
import { Send } from "lucide-react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

const socket = io("http://localhost:3000");

export default function CommunityChat() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  // Fetch messages from the API and add an isSender flag
  useEffect(() => {
    async function fetchMessages() {
      try {
        const token = await getToken();
        const response = await axios.get(
          "http://localhost:3000/api/chat/messages",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const messagesWithIsSender = response.data.map((msg) => ({
          ...msg,
          isSender: msg.sender && msg.sender._id === user.id,
        }));
        setMessages(messagesWithIsSender);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    }
    if (isLoaded && user) {
      fetchMessages();
    }
  }, [isLoaded, user, getToken]);

  // Listen for new messages via socket and add the isSender flag
  useEffect(() => {
    if (!isLoaded || !user) return;

    const handleChatMessage = (msg) => {
      const newMsg = {
        ...msg,
        isSender: msg.senderId === user.id,
      };
      setMessages((prev) => [...prev, newMsg]);
    };

    socket.on("chat message", handleChatMessage);
    return () => socket.off("chat message", handleChatMessage);
  }, [isLoaded, user]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;
    if (!isLoaded || !user) return;

    const msgObj = {
      senderId: user.id,
      message: message.trim(),
    };

    socket.emit("chat message", msgObj);
    setMessage("");
  };

  return (
    <div className="flex flex-col h-[70vh] bg-gray-300 ">
      <div className=" flex flex-col h-full overflow-hidden ">
        {/* Chat Area */}
        <main className="flex-1 overflow-y-auto p-4 bg-opacity-50 rounded-xl backdrop-blur-md">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-4 flex ${
                msg.isSender ? "justify-end" : "justify-start"
              }`}
            >
              <div className=" w-fit rounded-lg flex items-start space-x-3">
                {!msg.isSender &&
                  (msg.sender && msg.sender.avatar ? (
                    <img
                      src={msg.sender.avatar}
                      alt="avatar"
                      className="w-9 h-9 rounded-full mt-1"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-neutral-600"></div>
                  ))}
                <div className="bg-zinc-100 py-1.5 px-3 rounded-xl rounded-tl-none">
                  {!msg.isSender && (
                    <p className="text-xs font-semibold text-zinc-800">
                      {msg.sender ? msg.sender.name : "Unknown"}
                    </p>
                  )}
                  <p
                    className={`text-lg ${
                      msg.isSender
                        ? "bg-blue-600 text-white rounded-br-none"
                        : ""
                    }`}
                  >
                    {msg.message}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </main>

        <form
          onSubmit={handleSendMessage}
          className="flex items-center gap-2 p-4"
        >
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 px-4 py-2 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
          />
          <button
            type="submit"
            className="px-2 py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 transition focus:outline-none"
          >
            <Send className="p-0.5" />
          </button>
        </form>
      </div>
    </div>
  );
}
