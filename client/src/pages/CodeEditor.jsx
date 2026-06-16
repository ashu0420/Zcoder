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
            setOutput(data.verdict);
        }
        else setOutput("Need Sign In");
    };

    return (
        <div>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "10px"
            }}>

                <select value={language} onChange={(e) => setLanguage(e.target.value)}>
                    <option value="cpp">C++</option>
                    <option value="javascript">JavaScript</option>
                    <option value="python">Python</option>
                </select>
            </div>
            <br />
            <Editor
                height="70vh"
                language={language === "cpp" ? "cpp" : language}
                value={code}
                theme="vs-dark"
                onChange={(value) => setCode(value)}
                options={{
                    fontSize: 14,
                    minimap: { enabled: false },
                    automaticLayout: true,
                }}
            />
            <br />
            <div
                style={{
                    marginTop: "10px",
                    display: "flex",
                    justifyContent: "flex-end"
                }}
            >
                <button onClick={runCode}>
                    Submit
                </button>
            </div>
            {output && <pre>{output}</pre>}
        </div>
    );
}

export default CodeEditor;
