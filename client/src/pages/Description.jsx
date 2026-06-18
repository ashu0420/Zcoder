import { useOutletContext } from "react-router-dom";

function Description() {
    const { problem } = useOutletContext();

    const difficultyColor = {
        Easy: "bg-green-100 text-green-700",
        Medium: "bg-yellow-100 text-yellow-700",
        Hard: "bg-red-100 text-red-700",
    };

    return (
        
        <div className="p-6 h-full overflow-y-auto">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl font-bold text-gray-900">
                    {problem.title}
                </h1>

                <div
                    className={`inline-flex mt-3 px-3 py-1 rounded-full text-sm font-semibold ${difficultyColor[problem.difficulty]
                        }`}
                >
                    {problem.difficulty}
                </div>
            </div>

            {/* Description */}
            <div className="bg-white border rounded-xl p-5 shadow-sm mb-6">
                <h2 className="text-lg font-semibold mb-3">
                    Description
                </h2>

                <p className="text-gray-700 leading-7 whitespace-pre-wrap">
                    {problem.description}
                </p>
            </div>

            {/* Examples */}
            <div>
                <h2 className="text-lg font-semibold mb-4">
                    Examples
                </h2>

                <div className="space-y-4">
                    {problem.testCases?.map((tc, index) => (
                        <div
                            key={index}
                            className="border rounded-xl overflow-hidden bg-white shadow-sm"
                        >
                            <div className="bg-gray-50 px-4 py-2 border-b font-medium">
                                Example {index + 1}
                            </div>

                            <div className="p-4">
                                <div className="mb-4">
                                    <div className="text-sm font-semibold text-gray-600 mb-2">
                                        Input
                                    </div>

                                    <pre className="bg-gray-900 text-green-400 p-3 rounded-lg overflow-x-auto text-sm">
                                        {tc.input}
                                    </pre>
                                </div>

                                <div>
                                    <div className="text-sm font-semibold text-gray-600 mb-2">
                                        Output
                                    </div>

                                    <pre className="bg-gray-900 text-blue-400 p-3 rounded-lg overflow-x-auto text-sm">
                                        {tc.output}
                                    </pre>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Constraints */}
            {problem.constraints?.length > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-3">
                        Constraints
                    </h2>

                    <div className="bg-white border rounded-xl p-5 shadow-sm">
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                            {problem.constraints.map((c, i) => (
                                <li key={i}>{c}</li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
}

export default Description;