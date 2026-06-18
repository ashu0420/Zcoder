import { useEffect, useState } from "react";
import { NavLink, Outlet, useParams } from "react-router-dom";
import API_URL from "../config/api";
import CodeEditor from "./CodeEditor";

function Problem() {
    const { slug } = useParams();
    const [problem, setProblem] = useState(null);

    useEffect(() => {
        const fetchProblem = async () => {
            const res = await fetch(
                `${API_URL}/api/problems/${slug}`
            );

            const data = await res.json();
            setProblem(data);
        };

        fetchProblem();
    }, [slug]);

    if (!problem) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <div className="h-[calc(100vh-64px)] flex flex-col bg-gray-50">
            {/* Tabs */}
            <div className="bg-white border-b px-6">
                <nav className="flex gap-6">
                    <NavLink
                        to=""
                        end
                        className={({ isActive }) =>
                            `py-4 border-b-2 font-medium transition ${isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`
                        }
                    >
                        Description
                    </NavLink>

                    <NavLink
                        to="mySubmissions"
                        className={({ isActive }) =>
                            `py-4 border-b-2 font-medium transition ${isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`
                        }
                    >
                        My Submissions
                    </NavLink>

                    <NavLink
                        to="allSubmissions"
                        className={({ isActive }) =>
                            `py-4 border-b-2 font-medium transition ${isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`
                        }
                    >
                        All Submissions
                    </NavLink>

                    <NavLink
                        to="discussion"
                        className={({ isActive }) =>
                            `py-4 border-b-2 font-medium transition ${isActive
                                ? "border-blue-500 text-blue-600"
                                : "border-transparent text-gray-500 hover:text-gray-700"
                            }`
                        }
                    >
                        Discussion
                    </NavLink>
                </nav>
            </div>

            {/* Main Layout */}
            <div className="flex flex-1 overflow-hidden">
                {/* Left Panel */}
                <div className="w-1/2 overflow-y-auto border-r bg-white">
                    <Outlet context={{ problem }} />
                </div>

                {/* Right Panel */}
                <div className="w-1/2 bg-white p-3">
                    <div className="h-full rounded-xl border shadow-sm overflow-hidden">
                        <CodeEditor
                            testCases={problem.testCases}
                            problemId={problem._id}
                            slug={slug}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Problem;