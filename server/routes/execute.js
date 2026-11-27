const express = require("express");
const Submission = require("../models/Submission");
const auth = require("../middleware/auth");
const { runInDocker } = require("../services/dockerExecutor");

const router = express.Router();

const SUPPORTED_LANGUAGES = new Set(["javascript", "python", "cpp"]);
const EXECUTION_TIMEOUT_MS = 2000;

function normalizeValue(val) {
    if (val === undefined || val === null) return "";
    return typeof val === "string" ? val.trim() : JSON.stringify(val);
}

router.post("/", auth, async (req, res) => {
    try {
        const { language, code, testCases, problemId, slug } = req.body;

        if (!language || typeof code !== "string" || !code.trim()) {
            return res.status(400).json({ verdict: "Language and code are required" });
        }
        if (!SUPPORTED_LANGUAGES.has(language)) {
            return res.status(400).json({ verdict: "Unsupported language" });
        }
        if (!Array.isArray(testCases) || testCases.length === 0) {
            return res.status(400).json({ verdict: "No test case provided" });
        }

        let finalResult = { verdict: "Passed" };

        for (let i = 0; i < testCases.length; i++) {
            const input = normalizeValue(testCases[i].input);
            const expectedOutput = normalizeValue(testCases[i].output);

            const execRes = await runInDocker({
                language,
                code,
                input: input ? `${input}\n` : "",
                timeoutMs: EXECUTION_TIMEOUT_MS,
            });

            if (execRes.timedOut) {
                finalResult = { verdict: "Time Limit Exceeded", failedCase: i + 1 };
                break;
            }
            if (language === "cpp" && execRes.exitCode === 2) {
                finalResult = {
                    verdict: "Compile Error",
                    error: execRes.stderr.trim() || "Compilation failed",
                };
                break;
            }
            if (execRes.exitCode !== 0) {
                finalResult = {
                    verdict: "Runtime Error",
                    failedCase: i + 1,
                    error: execRes.stderr.trim() || `Process exited with code ${execRes.exitCode}`,
                };
                break;
            }

            const actualOutput = execRes.stdout.trim();
            if (actualOutput !== expectedOutput) {
                finalResult = {
                    verdict: "Failed",
                    failedCase: i + 1,
                    expected: expectedOutput,
                    actual: actualOutput,
                };
                break;
            }
        }

        if (req.user?.userId) {
            await Submission.create({
                user: req.user.userId,
                problem: problemId,
                slug,
                language,
                code,
                verdict: finalResult.verdict,
            });
        }

        return res.json(finalResult);
    } catch (err) {
        return res.status(500).json({ verdict: "Server error", error: err.message });
    }
});

module.exports = router;
