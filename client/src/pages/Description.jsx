
import { useOutletContext } from "react-router-dom";

function Description() {
    const { problem } = useOutletContext();

    return (
        <div>
            <h2>{problem.title}</h2>
            <div
                style={{
                    display: "inline-block",
                    padding: "4px 10px",
                    borderRadius: "6px",
                    backgroundColor: "#fef3c7",
                    marginBottom: "12px"
                }}
            >
                {problem.difficulty}
            </div>
            <p>{problem.description}</p>

            <h3>Test cases</h3>
            {/* <h3>Input</h3>
            <pre>{problem.input}</pre>
            
            <h3>Expected Output</h3>
            <pre>{problem.output}</pre> */}

            <ul>
                {
                    problem.testCases.map((tc, index) => (
                        <div
                            key={index}
                            style={{
                                border: "1px solid #ddd",
                                borderRadius: "8px",
                                padding: "12px",
                                marginBottom: "12px",
                                background: "#f9fafb"
                            }}
                        >
                            <div>
                                <strong>Input:</strong>
                            </div>
                            <pre>{tc.input}</pre>

                            <div>
                                <strong>Output:</strong>
                            </div>
                            <pre>{tc.output}</pre>
                        </div>
                    ))
                }
            </ul>
        </div>)
}
export default Description;