import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API_URL from "../config/api";

function Submission() {
    const { submissionId } = useParams();
    const [solution, setSolution] = useState();
    useEffect(() => {
        const fetchSol = async () => {
            const res = await fetch(` ${API_URL}/api/submissions/submission/${submissionId}`);
            if (!res.ok) {
                const text = await res.text();
                throw new Error(text);
            }

            const data = await res.json();
              
            setSolution(data);
        }
        fetchSol();
    }, [submissionId]);
    if (!solution) return <h2>Loading...</h2>;
    console.log(solution);
    return (<div>
        <p><b>ID:</b> {solution._id}</p>
        <p><b>Submitted:</b> {new Date(solution.createdAt).toLocaleString()}</p>
        <p><b>Language:</b> {solution.language}</p>
        {/* <p><b>{solution.tit}</b></p> */}
        <div>
        <h3>Code</h3>

        </div>
        <pre>{solution.code}</pre>
    </div>);
}
export default Submission;