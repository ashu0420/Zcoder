import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import API_URL from "../config/api";
function Home() {
    const [posts, setPosts] = useState([]);
    const [post, setPost] = useState("");
    const [title, setTitle] = useState("");
    const [contests, setContests] = useState([]);
    const { token } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        const fetchData = async () => {
            // Posts
            const res = await fetch(`${API_URL}/api/posts`);
            const data = await res.json();
            setPosts(data);
            // console.log(data);

            // Contests
            const res2 = await fetch(`${API_URL}/api/contests`);
            const contestData = await res2.json();

            const now = Date.now();
            const next24h = now + 24 * 60 * 60 * 1000;

            const filtered = contestData.filter(c => {
                const start = new Date(c.start).getTime();
                return start > now && start <= next24h;
            });

            setContests(filtered);
        };

        fetchData();
    }, []);
    const sendPost = async () => {
        if (!token) return navigate("/auth/signin");

        if (!title || !post) {
            return alert("Title and content required");
        }

        const res = await fetch(`${API_URL}/api/posts`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
                title,
                content: post
            })
        });

        const data = await res.json();

        setPosts(prev => [data, ...prev]);
        setPost("");
        setTitle("");
    };

    return (
        <div
            style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "30px",
                marginTop: "20px"
            }}
        >
            <div>



                {/* 📝 POSTS */}
                <h2>Latest Updates</h2>
                <h3>Posts</h3>

                {posts.map(post => (
                    <div
                        key={post._id}
                        style={{
                            padding: "12px",
                            marginBottom: "16px",
                            border: "1px solid #ddd",
                            borderRadius: "8px",
                            background: "#fff"
                        }}
                  >
                        <h3
                            style={{
                                fontSize: "22px",
                                marginBottom: "6px"
                            }}
                        >
                            {post.title}
                        </h3>
                        <div style={{
                            color: "#666",
                            marginBottom: "10px"
                        }}>
                            {post.authorName} • {new Date(post.createdAt).toLocaleDateString()}
                        </div>
                        <p>{post.content.slice(0, 120)}...</p>
                    </div>
                ))}
                <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter title"
                    style={{ display: "block", marginBottom: "10px", width: "300px" }}
                />
                <textarea name="" id="" value={post} onChange={(e) => { setPost(e.target.value) }} placeholder="Type here"></textarea>
                <button onClick={sendPost}>{token ? "Send" : "Login"}</button>
            </div>
            <div>
                {/* ⏳ CONTESTS */}
                <h2 style={{ marginTop: "30px" }}>Upcoming (Next 24h)</h2>

                {contests.length === 0 ? (
                    <p>No contests in next 24 hours</p>
                ) : (
                    contests.map(c => (
                        <div key={c.id} style={{ marginBottom: "10px" }}>
                            <a href={c.href} target="_blank" rel="noreferrer">
                                <b>{c.event}</b>
                            </a>
                            <div>
                                {c.resource.name} — {new Date(c.start).toLocaleString()}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default Home;