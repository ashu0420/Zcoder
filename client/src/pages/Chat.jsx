import { useState, useEffect } from "react";
import { io } from 'socket.io-client';
import { useAuth } from "../context/AuthContext";
import { useRef } from "react";
import API_URL from "../config/api";
const socket = io(`${API_URL}`);


function Chat({ selectedUser, setSelectedUser }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const { userId, token } = useAuth();
    const messagesEndRef = useRef(null);
    const toUserId = selectedUser._id;
    // console.log(selectedUser);
    // console.log(toUserId);
    // console.log(token);
    useEffect(() => {
        if (userId) {
            socket.emit("register", userId);
        }
    }, [userId]);
    useEffect(() => {
        if (!selectedUser || !token) return;

        const fetchMessages = async () => {
            const res = await fetch(
                `${API_URL}/api/profile/${selectedUser._id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await res.json();

            if (!res.ok) {
                console.log(data.message);
                return;
            }

            setMessages(data);
        };

        fetchMessages();
    }, [selectedUser, token]);

    const sendMessage = () => {
        if (!message) return;
        if (!selectedUser) {
            alert("Select a user first");
            return;
        }
        socket.emit("send_message", {
            toUserId: toUserId,
            message
        });
        setMessages(prev => [
            ...prev,
            {
                from: userId,
                to: toUserId,
                message
            }
        ]);
        setMessage("");
    };

    useEffect(() => {
        if (!selectedUser) return;

        const handler = (data) => {
            if (
                data.from === selectedUser._id ||
                data.to === selectedUser._id
            ) {
                setMessages((prev) => [...prev, data]);
            }
        };

        socket.on("receive_message", handler);

        return () => socket.off("receive_message", handler);
    }, [selectedUser]);
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);
    return (
        <div className="mt-4">
            <div className="h-[500px] border rounded-2xl overflow-hidden bg-white flex flex-col">

                {/* Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b bg-gray-50">
                    <div>
                        <h3 className="font-semibold">
                            {selectedUser.username}
                        </h3>
                    </div>

                    <button
                        onClick={() => setSelectedUser(null)}
                        className="text-sm text-red-500 hover:text-red-700"
                    >
                        Back
                    </button>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                        <p className="text-gray-500 text-center">
                            No messages yet
                        </p>
                    ) : (
                        messages.map((msg, idx) => {
                            const isMine = msg.from === userId;

                            return (
                                <div
                                    key={msg._id || idx}
                                    className={`flex ${isMine
                                        ? "justify-end"
                                        : "justify-start"
                                        }`}
                                >
                                    <div
                                        className={`max-w-[70%] px-4 py-2 rounded-2xl break-words ${isMine
                                            ? "bg-blue-500 text-white"
                                            : "bg-white border"
                                            }`}
                                    >
                                        {msg.message}
                                    </div>
                                </div>
                            );
                        })
                    )}
                    <div ref={messagesEndRef}></div>
                </div>

                {/* Input */}
                <div className="border-t p-3 flex gap-3">
                    <input
                        value={message}
                        onChange={(e) =>
                            setMessage(e.target.value)
                        }
                        onKeyDown={(e) => {
                            if (e.key === "Enter") {
                                sendMessage();
                            }
                        }}
                        placeholder="Type a message..."
                        className="flex-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />

                    <button
                        onClick={sendMessage}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-xl font-medium"
                    >
                        Send
                    </button>
                </div>
            </div>
        </div>
    );
}
export default Chat;