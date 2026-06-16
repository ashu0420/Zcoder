import { useEffect, useState } from "react";
import { useOutletContext, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";
function MySubmissions() {
    const { problem } = useOutletContext();
    const { userId } = useAuth();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const problemId = problem._id;
    // console.log(userId);


    useEffect(() => {

        const fetchSubmissions = async () => {

            try {
                const res = await fetch(
                    `${API_URL}/api/submissions/${problemId}/${userId}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch submissions");
                }

                const data = await res.json();
                setSubmissions(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        if (userId !== null) {
            fetchSubmissions();
        }
    }, [problemId, userId]);
    if (userId === null) { return <h2>Need login</h2> }
    if (loading) return <h3>Loading submissions...</h3>;
    if (error) return <h3>{error}</h3>;

    return (
        <div>
            <h2>My Submissions</h2>

            {submissions.length === 0 ? (
                <p>No submissions yet.</p>
            ) : (
                <ul>
                    {submissions.map((s) => (
                        <li key={s._id}>
                            <Link to={`../../submission/${s._id}`}>
                                {s._id}:
                            </Link>
                            {" — "}
                            <Link to={`../`}>
                                {s.problem.title}:
                            </Link>
                            <b>Submitted:</b>{" "}
                            {new Date(s.createdAt).toLocaleString()}
                            {" — "}
                            <b>Verdict:</b> {s.verdict}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default MySubmissions;
