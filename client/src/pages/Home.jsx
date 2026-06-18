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

            const now = Date.now();
            const next24h = now + 24 * 60 * 60 * 1000;
            const contestData = await res2.json();

            if (!Array.isArray(contestData)) {
                console.error("Contest API returned:", contestData);
                setContests([]);
                return;
            }

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
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-6">

            {/* POSTS */}
            <div className="lg:col-span-3">

                <div className="flex justify-between items-center mb-4">
                    <div className="pl-2">
                        <h2 className="text-3xl font-bold">
                            Latest Updates
                        </h2>

                        <p className="text-gray-500">
                            {posts.length} posts
                        </p>
                    </div>

                    <button
                        onClick={() => navigate("/posts")}
                        className="text-blue-600 hover:text-blue-800 font-semibold"
                    >
                        View All →
                    </button>
                </div>

                {posts.slice(0, 5).map((post) => (
                    <div
                        key={post._id}
                        className="
                            bg-white
                            border
                            border-gray-200
                            rounded-xl
                            shadow-sm
                            hover:shadow-lg
                            transition
                            duration-200
                            p-6
                            mb-5
                            cursor-pointer
                        "
                    >
                        <h3 className="text-2xl font-bold mb-2">
                            {post.title}
                        </h3>

                        <div className="text-sm text-gray-500 mb-3">
                            {post.authorName &&
                                `By ${post.authorName} • `}
                            {new Date(
                                post.createdAt
                            ).toLocaleDateString(
                                "en-US",
                                {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric"
                                }
                            )}
                        </div>

                        <p className="text-gray-700 leading-7">
                            {post.content.length > 150
                                ? post.content.slice(0, 150) +
                                "..."
                                : post.content}
                        </p>
                    </div>
                ))}
            </div>

            {/* SIDEBAR */}
            <div className="space-y-6">

                {/* CREATE POST */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

                    <h3 className="text-xl font-semibold mb-4">
                        Create Post
                    </h3>

                    <input
                        type="text"
                        value={title}
                        onChange={(e) =>
                            setTitle(e.target.value)
                        }
                        placeholder="Enter title"
                        className="
                            w-full
                            border
                            border-gray-300
                            rounded-lg
                            p-3
                            mb-3
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                    <textarea
                        value={post}
                        onChange={(e) =>
                            setPost(e.target.value)
                        }
                        placeholder="Share an update..."
                        className="
                            w-full
                            min-h-[120px]
                            border
                            border-gray-300
                            rounded-lg
                            p-3
                            mb-4
                            resize-none
                            focus:outline-none
                            focus:ring-2
                            focus:ring-blue-500
                        "
                    />

                    <button
                        onClick={sendPost}
                        className="
                            w-full
                            bg-blue-600
                            hover:bg-blue-700
                            text-white
                            py-3
                            rounded-lg
                            font-medium
                        "
                    >
                        {token
                            ? "Publish Post"
                            : "Login"}
                    </button>
                </div>

                {/* CONTESTS */}
                <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-5">

                    <h3 className="text-xl font-semibold mb-4">
                        Upcoming Contests
                    </h3>

                    {contests.length === 0 ? (
                        <>
                            <div
                                className="
                                    bg-orange-50
                                    border
                                    border-orange-200
                                    text-orange-700
                                    rounded-lg
                                    p-3
                                    mb-4
                                "
                            >
                                🔥 No contests in next 24
                                hours
                            </div>

                            <p className="text-gray-600 text-sm mb-4">
                                Check the contests page for
                                upcoming programming
                                contests.
                            </p>

                            <button
                                onClick={() =>
                                    navigate("/contests")
                                }
                                className="
                                    w-full
                                    bg-blue-600
                                    hover:bg-blue-700
                                    text-white
                                    py-3
                                    rounded-lg
                                    font-medium
                                "
                            >
                                Browse Contests
                            </button>
                        </>
                    ) : (
                        contests.map((c) => (
                            <div
                                key={c.id}
                                className="
                                    border
                                    border-gray-200
                                    rounded-lg
                                    p-3
                                    mb-3
                                "
                            >
                                <a
                                    href={c.href}
                                    target="_blank"
                                    rel="noreferrer"
                                    className="
                                        text-blue-600
                                        font-semibold
                                        hover:underline
                                    "
                                >
                                    {c.event}
                                </a>

                                <div className="text-sm text-gray-500 mt-2">
                                    {c.resource}
                                </div>

                                <div className="text-sm text-blue-600 mt-1">
                                    {new Date(
                                        c.start
                                    ).toLocaleString()}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}

export default Home;