import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useOutletContext, useNavigate } from "react-router-dom"
import API_URL from "../config/api";
function Discussion() {

    const { token } = useAuth();
    const { problem } = useOutletContext();
    const [chat, setChat] = useState("");
    const [posts, setPosts] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetch(`${API_URL}/api/problems/${problem._id}/discussion`)
        .then(res => res.json())
        .then(setPosts);
    }, [problem._id]);
    if (!problem) return <h2>Loading...</h2>;
    const sendChat = async () => {
        if (!chat.trim()) return;
        if (!token) return navigate("/auth/signin");
        const res = await fetch(`${API_URL}/api/problems/${problem._id}/discussion`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                content: chat
            })
        });
        const data = await res.json();
        setPosts(prev => [data, ...prev]);
        setChat("");

    }
    return (
        <div className="max-w-4xl mx-auto p-6">

            {/* Create Post */}
            <div className="bg-white rounded-xl shadow p-5 mb-6">
                <h2 className="text-2xl font-bold mb-4">
                    Discussion
                </h2>

                <textarea
                    value={chat}
                    onChange={(e) => setChat(e.target.value)}
                    placeholder="Share your thoughts about this problem..."
                    rows={4}
                    className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

                <div className="mt-3 flex justify-end">
                    <button
                        onClick={sendChat}
                        className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700"
                    >
                        {token ? "Post" : "Login to Post"}
                    </button>
                </div>
            </div>

            {/* Posts */}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="bg-white rounded-xl shadow p-6 text-center text-gray-500">
                        No discussions yet. Be the first to comment.
                    </div>
                ) : (
                    posts.map((p) => (
                        <div
                            key={p._id}
                            className="bg-white rounded-xl shadow p-5"
                        >
                            <div className="flex justify-between items-center mb-3">
                                <div className="font-semibold text-lg">
                                    {p.user?.username || "Unknown User"}
                                </div>

                                <div className="text-sm text-gray-500">
                                    {new Date(p.createdAt).toLocaleString()}
                                </div>
                            </div>

                            <p className="text-gray-700 whitespace-pre-wrap">
                                {p.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

        </div>
    );
}
export default Discussion;