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
    if (submissions.length === 0) {
        return (
            <div className="bg-white rounded-xl shadow p-8 text-center">
                <h2 className="text-xl font-semibold">
                    No submissions yet
                </h2>
                <p className="text-gray-500 mt-2">
                    Submit a solution to see it here.
                </p>
            </div>
        );
    }
    const verdictColors = {
        Passed: "bg-green-100 text-green-700",
        Failed: "bg-red-100 text-red-700",
        "Compile Error": "bg-orange-100 text-orange-700",
        "Runtime Error": "bg-yellow-100 text-yellow-700",
        "Time Limit Exceeded": "bg-purple-100 text-purple-700",
    };
    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            {/* <div className="bg-red-500 text-white p-4 rounded">
                Tailwind Test
            </div> */}
            {/* Stats */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-green-100 rounded-xl p-4 shadow">
                    <h3 className="font-semibold text-green-700">
                        Accepted
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        {submissions.filter(
                            (s) => s.verdict === "Passed"
                        ).length}
                    </p>
                </div>

                <div className="bg-red-100 rounded-xl p-4 shadow">
                    <h3 className="font-semibold text-red-700">
                        Failed
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        {submissions.filter(
                            (s) => s.verdict === "Failed"
                        ).length}
                    </p>
                </div>

                <div className="bg-blue-100 rounded-xl p-4 shadow">
                    <h3 className="font-semibold text-blue-700">
                        Total
                    </h3>
                    <p className="text-3xl font-bold mt-2">
                        {submissions.length}
                    </p>
                </div>
            </div>

            {/* Main Layout */}

            <div className="bg-white border border-gray-200 rounded-xl shadow overflow-hidden">

                <div className="p-4 border-b bg-gray-50">
                    <h2 className="text-2xl font-bold text-gray-800">
                        Submission History
                    </h2>

                    <p className="text-gray-500 text-sm mt-1">
                        {submissions.length} submissions
                    </p>
                </div>

                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Language
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                                Submitted
                            </th>
                            <th className="px-6 py-3"></th>
                        </tr>
                    </thead>

                    <tbody className="divide-y divide-gray-100">
                        {submissions.map((s) => (
                            <tr
                                key={s._id}
                                className="hover:bg-blue-50 transition"
                            >
                                <td className="px-6 py-4 text-gray-700">
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-semibold ${verdictColors[s.verdict] || "bg-gray-100 text-gray-700"
                                            }`}
                                    >
                                        {s.verdict}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded-md text-sm font-medium">
                                        {s.language.toUpperCase()}
                                    </span>
                                </td>
                                <td>
                                    {new Date(s.createdAt).toLocaleString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        hour: "numeric",
                                        minute: "2-digit",
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        to={`../../submission/${s._id}`}
                                        className="text-blue-600 hover:text-blue-800 font-medium"
                                    >
                                        View →
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default MySubmissions;
