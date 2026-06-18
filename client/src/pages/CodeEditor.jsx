import { useEffect, useState } from "react";
import Editor from "@monaco-editor/react";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function CodeEditor({ testCases, problemId, slug }) {
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("cpp");
    const [output, setOutput] = useState("");
    const { token } = useAuth();
    // const token = localStorage.getItem("token");

    const starterCode = {
        javascript: `const fs = require("fs");\nconst input = fs.readFileSync(0,"utf8");\nconsole.log(input);`,
        cpp: `#include <bits/stdc++.h>\nusing namespace std;\nint main(){\n    return 0;\n}`,
        python: `import sys\nprint(sys.stdin.read())`,
    };

    useEffect(() => {
        setCode(starterCode[language]);
    }, [language]);

    const runCode = async () => {
        if (token) {
            const res = await fetch(`${API_URL}/api/execute`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    problemId,
                    slug,
                    language,
                    code,
                    testCases,

                }),
            });
            // console.log

            const data = await res.json();
            setOutput({
                verdict: data.verdict,
              });
        }
        else setOutput("Need Sign In");
    };

    return (
        <div className="h-full flex flex-col bg-white">
            {/* Top Bar */}
            <div className="flex items-center justify-between p-3 border-b bg-gray-50">
                <div className="flex items-center gap-3">
                    <span className="text-sm font-semibold text-gray-600">
                        Language
                    </span>

                    <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="px-3 py-2 border rounded-lg bg-white text-sm"
                    >
                        <option value="cpp">C++</option>
                        <option value="javascript">JavaScript</option>
                        <option value="python">Python</option>
                    </select>
                </div>

                <button
                    onClick={runCode}
                    className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-lg font-medium transition"
                >
                    Submit
                </button>
            </div>

            {/* Editor */}
            <div className="flex-1 overflow-hidden">
                <Editor
                    height="100%"
                    language={language === "cpp" ? "cpp" : language}
                    value={code}
                    theme="vs-dark"
                    onChange={(value) => setCode(value)}
                    options={{
                        fontSize: 15,
                        minimap: { enabled: false },
                        automaticLayout: true,
                        scrollBeyondLastLine: false,
                        padding: {
                            top: 15,
                        },
                    }}
                />
            </div>

            {/* Output Panel */}
            {output && (
                <div
                    className={`border-t p-4 max-h-48 overflow-y-auto ${output.verdict === "Accepted"
                            ? "bg-green-50"
                            : "bg-red-50"
                        }`}
                >
                    <div
                        className={`font-bold ${output.verdict === "Accepted"
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                    >
                        {output.verdict}
                    </div>
                </div>
            )}
        </div>
      );
}

export default CodeEditor;
