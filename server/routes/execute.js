const express = require("express");
const fs = require("fs").promises;
const path = require("path");
const os = require("os");
const { spawn } = require("child_process");
const Submission = require("../models/Submission");
const auth = require("../middleware/auth");

const router = express.Router();

router.post("/", auth, async (req, res) => {
    let filePath = "";
    let binaryPath = "";

    try {
        const { language, code, testCases, problemId, slug } = req.body;


        if (!language || !code) return res.json({ verdict: "Language and code are required" });
        if (!Array.isArray(testCases) || testCases.length === 0) return res.json({ verdict: "No test case provided" });

        const base = `code-${Date.now()}`;
        const tmp = os.tmpdir();
        let runCmd, runArgs = [];


        if (language === "javascript") {
            filePath = path.join(tmp, `${base}.js`);
            await fs.writeFile(filePath, code);
            runCmd = "node";
            runArgs = [filePath];
        }
        else if (language === "python") {
            filePath = path.join(tmp, `${base}.py`);
            await fs.writeFile(filePath, code);
            runCmd = "python3";
            runArgs = [filePath];
        }
        else if (language === "cpp") {
            filePath = path.join(tmp, `${base}.cpp`);
            binaryPath = path.join(tmp, `${base}.out`);
            await fs.writeFile(filePath, code);


            const compile = spawn("g++", [filePath, "-o", binaryPath]);
            let compileErr = "";
            compile.stderr.on("data", d => compileErr += d.toString());

            const exitCode = await new Promise((resolve) => compile.on("close", resolve));
            if (exitCode !== 0) {
                await cleanup(filePath, binaryPath);
                return res.json({ verdict: "Compile Error", error: compileErr });
            }
            runCmd = binaryPath;
        }
        else {
            return res.json({ verdict: "Unsupported language" });
        }

        const input =
            typeof testCases[0].input === "string"
                ? testCases[0].input.trim()
                : JSON.stringify(testCases[0].input);

        const expectedOutput =
            typeof testCases[0].output === "string"
                ? testCases[0].output.trim()
                : JSON.stringify(testCases[0].output);
        // console.log("INPUT:", input);
        // console.log("EXPECTED:", expectedOutput);
        const result = await runProgram(runCmd, runArgs, input, expectedOutput);

        await Submission.create({
            user: req.user.userId,
            problem: problemId,
            slug,
            language,
            code,
            verdict: result.verdict,
        });

        await cleanup(filePath, binaryPath);
        return res.json(result);

    } catch (err) {
        await cleanup(filePath, binaryPath);
        res.json({ verdict: "Server error", error: err.message });
    }
});

function runProgram(cmd, args, input, expectedOutput) {
    return new Promise((resolve) => {
        const child = spawn(cmd, args);
        let stdout = "", stderr = "", finished = false;

        const timer = setTimeout(() => {
            if (!finished) {
                finished = true;
                child.kill("SIGKILL");
                resolve({ verdict: "Time Limit Exceeded" });
            }
        }, 2000);

        child.stdout.on("data", d => stdout += d.toString());
        child.stderr.on("data", d => stderr += d.toString());
        if (input) child.stdin.write(input + "\n");
        child.stdin.end();

        child.on("close", () => {
            if (finished) return;
            finished = true;
            clearTimeout(timer);

            if (stderr) return resolve({ verdict: "Runtime Error", error: stderr });
            if (stdout.trim() === String(expectedOutput).trim()) return resolve({ verdict: "Passed" });
            return resolve({ verdict: "Failed", expected: expectedOutput, actual: stdout.trim() });
        });
    });
}


async function cleanup(f1, f2) {
    try {
        if (f1) await fs.unlink(f1);
        if (f2) await fs.unlink(f2);
    } catch (e) { /* ignore cleanup errors */ }
}

module.exports = router;