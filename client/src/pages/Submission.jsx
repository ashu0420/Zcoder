import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Editor from "@monaco-editor/react";
import API_URL from "../config/api";

function Submission() {
    const { submissionId } = useParams();
    const navigate = useNavigate();

    const [solution, setSolution] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSol = async () => {
            try {
                const res = await fetch(
                    `${API_URL}/api/submissions/submission/${submissionId}`
                );

                if (!res.ok) {
                    throw new Error("Failed to fetch submission");
                }

                const data = await res.json();
                setSolution(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchSol();
    }, [submissionId]);

    if (loading) {
        return (
            <div className="p-6">
                <h2>Loading...</h2>
            </div>
        );
    }

    if (!solution) {
        return (
            <div className="p-6">
                <h2>Submission not found</h2>
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
        <div className="max-w-7xl mx-auto p-6 bg-gray-50 min-h-screen">

            {/* Back Button */}
            <button
                onClick={() => navigate(-1)}
                className="mb-4 text-blue-600 hover:text-blue-800"
            >
                ← Back to Submissions
            </button>

            {/* Header */}
            <div className="bg-white rounded-xl shadow p-6 mb-6">

                <div className="flex justify-between items-center">

                    <div>
                        <h1 className="text-3xl font-bold">
                            Submission Details
                        </h1>

                        <p className="text-gray-500 mt-2">
                            {new Date(solution.createdAt).toLocaleString(
                                "en-IN",
                                {
                                    day: "numeric",
                                    month: "short",
                                    year: "numeric",
                                    hour: "numeric",
                                    minute: "2-digit",
                                }
                            )}
                        </p>
                    </div>

                    <span
                        className={`px-4 py-2 rounded-full font-semibold ${verdictColors[solution.verdict] ||
                            "bg-gray-100 text-gray-700"
                            }`}
                    >
                        {solution.verdict}
                    </span>
                </div>
            </div>

            {/* Info Cards */}
            <div className="grid grid-cols-3 gap-4 mb-6">

                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-gray-500">
                        Language
                    </p>

                    <p className="text-lg font-semibold mt-1">
                        {solution.language.toUpperCase()}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-gray-500">
                        Verdict
                    </p>

                    <p className="text-lg font-semibold mt-1">
                        {solution.verdict}
                    </p>
                </div>

                <div className="bg-white rounded-xl shadow p-4">
                    <p className="text-sm text-gray-500">
                        Submission ID
                    </p>

                    <p className="text-lg font-semibold mt-1">
                        {solution._id.slice(-8)}
                    </p>
                </div>

            </div>

            {/* Code Section */}
            <div className="bg-white rounded-xl shadow overflow-hidden">

                <div className="p-4 border-b">
                    <h2 className="text-xl font-semibold">
                        Submitted Code
                    </h2>
                </div>

                <Editor
                    height="650px"
                    language={
                        solution.language === "cpp"
                            ? "cpp"
                            : solution.language
                    }
                    value={solution.code}
                    theme="vs-dark"
                    options={{
                        readOnly: true,
                        minimap: { enabled: false },
                        fontSize: 14,
                        scrollBeyondLastLine: false,
                    }}
                />
            </div>

        </div>
    );
}

export default Submission;