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

        fetchUser();
    }, [token]);
    const handleSignOut = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("username");
        setUserId(null);
        setToken(null);
        navigate("/auth/signin");
    }
    return <>
        <div
            style={{
                border: "1px solid #ddd",
                borderRadius: "10px",
                padding: "16px",
                marginBottom: "20px"
            }}
        ><h2>{user?.username}</h2>
            <p>{user?.email}</p>
            {/* {console.log(JSON.stringify(user, null, 2))} */}
        </div>
        <div>
            <h2>My Submissions</h2>

            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <div
                    
                >
                    {submissions.map((s) => (
                        <div key={s._id}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "10px"
                          }}>

<div
    style={{
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center"
                                }}
                            >
                                <div>
                                    <Link
                                        to={`../problems/${s.problem.slug}`}
                                        style={{
                                            fontWeight: "600",
                                            textDecoration: "none"
                                        }}
                                    >
                                        {s.problem.title}
                                    </Link>

                                    <div
                                        style={{
                                            fontSize: "14px",
                                            color: "#666",
                                            marginTop: "4px"
                                        }}
                                    >
                                        {new Date(s.createdAt).toLocaleString()}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: "10px"
                                    }}
                                >
                                    <Link to={`../submission/${s._id}`}>
                                        View
                                    </Link>

                                    <span
                                        style={{
                                            padding: "4px 8px",
                                            borderRadius: "6px",
                                            backgroundColor:
                                                s.verdict === "Passed"
                                                    ? "#dcfce7"
                                                    : "#fee2e2"
                                        }}
                                    >
                                        {s.verdict}
                                    </span>
                                </div>
                            </div>
                            <span
                                style={{
                                    padding: "4px 8px",
                                    borderRadius: "6px",
                                    backgroundColor:
                                        s.verdict === "Passed"
                                            ? "#dcfce7"
                                            : "#fee2e2"
                                }}
                            >
                                {s.verdict}
                            </span>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <h4>Chat</h4>
        <div style={{ position: "relative" }}>

            <button onClick={() => setOpen(!open)}>
                {selectedUser?.username || "Select User"} ▼
            </button>

            {open && (
                <div
                    style={{
                        position: "absolute",
                        background: "#fff",
                        border: "1px solid #ccc",
                        width: "150px",
                    }}
                >
                    {users.map((u) => (
                        <p
                            key={u._id}
                            style={{ padding: "8px", cursor: "pointer" }}
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
            {selectedUser && <Chat selectedUser={selectedUser} setSelectedUser={setSelectedUser} />}
            {/* <div> <Chat /></div> */}

        </div>
        <button onClick={handleSignOut}>Sign Out</button>

    </>
}