import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Chat from './Chat';
import API_URL from "../config/api";

export default function Profile() {
    const { setToken, setUserId, token } = useAuth();
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    const [users, setUsers] = useState([]);
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState();
    const [fav, setFav] = useState([]);

    useEffect(() => {
        if (!token) return;

        const fetchUser = async () => {
            const res = await fetch(`${API_URL}/api/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            const data = await res.json();
            setUser(data);
            setSubmissions(data.submissions);
            setUsers(data.users);
        };
        const fetchFav = async () => {
            try {
                const res = await fetch(`${API_URL}/api/problems/fav`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!res.ok) return;

                const data = await res.json();
                setFav(data || []);
            } catch (err) {
                console.log(err);
            }
        };
        fetchFav();
        fetchUser();
    }, [token]);
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        setUserId(null);
        setToken(null);
        navigate("/auth/signin");
    };
    const acceptedCount = submissions.filter(
        s => s.verdict === "Passed"
    ).length;

    const failedCount = submissions.filter(
        s => s.verdict === "Failed"
    ).length;
    const solvedProblems = new Set(
        submissions
            .filter(s => s.verdict === "Passed")
            .map(s => s.problem?._id || s.problem)
    ).size;
    const acceptanceRate =
        submissions.length === 0
            ? 0
            : Math.round((acceptedCount * 100) / submissions.length);

    return (
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
            {/* Profile Header */}
            <div className="bg-white rounded-2xl shadow-sm border p-8 mb-8">
                <div className="flex items-center gap-5">
                    <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-3xl font-bold">
                        {user?.username?.charAt(0).toUpperCase()}
                    </div>

                    <div>
                        <h1 className="text-4xl font-bold text-gray-900">
                            {user?.username}
                        </h1>

                        <p className="text-gray-500 mt-1">
                            {user?.email}
                        </p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-5 mb-8">
                <div className="bg-green-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-green-700">
                        Accepted
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {acceptedCount}
                    </p>
                </div>

                <div className="bg-red-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-red-700">
                        Failed
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {failedCount}
                    </p>
                </div>

                <div className="bg-blue-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-blue-700">
                        Submissions
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {submissions.length}
                    </p>
                </div>

                <div className="bg-purple-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-purple-700">
                        Solved
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {solvedProblems}
                    </p>
                </div>

                <div className="bg-yellow-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-yellow-700">
                        Acceptance
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {acceptanceRate}%
                    </p>
                </div>

                <div className="bg-orange-100 rounded-xl p-5 shadow-sm text-center hover:scale-105 transition">
                    <h3 className="font-semibold text-orange-700">
                        Favourites
                    </h3>
                    <p className="text-4xl font-bold mt-2">
                        {fav.length}
                    </p>
                </div>
            </div>

            {/* Favourite Problems */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-5">
                    ⭐ Favourite Problems
                </h2>

                {fav.length === 0 ? (
                    <p className="text-gray-500">
                        No favourite problems yet.
                    </p>
                ) : (
                    <div className="space-y-3">
                        {fav.slice(0, 5).map((f) => (
                            <Link
                                key={f._id}
                                to={`/ problems / ${f.pid.slug} `}
                                className="block p-4 border rounded-xl hover:bg-blue-50 hover:border-blue-300 transition"
                            >
                                {f.pid.title}
                            </Link>
                        ))}
                    </div>
                )}
            </div>

            {/* Submissions */}
            <div className="mb-8">
                <h2 className="text-2xl font-bold mb-5">
                    Recent Submissions
                </h2>

                {submissions.length === 0 ? (
                    <div className="bg-white rounded-xl border p-6">
                        No submissions yet.
                    </div>
                ) : (
                    <div className="space-y-3">
                        {submissions.map((s) => (
                            <div
                                key={s._id}
                                className="bg-white border rounded-xl p-4 hover:shadow-md transition"
                            >
                                <div className="flex justify-between items-center">
                                    <div>
                                        <Link
                                            to={`../ problems / ${s.problem.slug} `}
                                            className="font-semibold text-blue-600 hover:text-blue-800"
                                        >
                                            {s.problem.title}
                                        </Link>

                                        <div className="text-sm text-gray-500 mt-1">
                                            {new Date(
                                                s.createdAt
                                            ).toLocaleString()}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-4">
                                        <Link
                                            to={`../ submission / ${s._id} `}
                                            className="text-blue-600 hover:underline"
                                        >
                                            View
                                        </Link>

                                        <span
                                            className={`px - 3 py - 1 rounded - lg text - sm font - medium ${s.verdict === "Passed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                                } `}
                                        >
                                            {s.verdict}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Chat */}
            <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
                <h2 className="text-2xl font-bold mb-5">
                    Chat
                </h2>

                <div className="relative">
                    <button
                        onClick={() => setOpen(!open)}
                        className="border rounded-xl px-4 py-2 bg-white hover:bg-gray-50"
                    >
                        {selectedUser?.username ||
                            "Select User"}{" "}
                        ▼
                    </button>

                    {open && (
                        <div className="absolute z-20 mt-2 w-52 bg-white border rounded-xl shadow-lg">
                            {users.map((u) => (
                                <p
                                    key={u._id}
                                    className="px-4 py-3 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => {
                                        setSelectedUser(u);
                                        setOpen(false);
                                    }}
                                >
                                    {u.username}
                                </p>
                            ))}
                        </div>
                    )}
                </div>

                {selectedUser && (
                    <div className="mt-5">
                        <Chat
                            selectedUser={selectedUser}
                            setSelectedUser={setSelectedUser}
                        />
                    </div>
                )}
            </div>

            <button
                onClick={handleSignOut}
                className="bg-red-600 hover:bg-red-700 text-white px-5 py-3 rounded-xl font-medium"
            >
                Sign Out
            </button>
        </div>
    );


}