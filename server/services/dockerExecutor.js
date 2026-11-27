const { spawn } = require("child_process");

const RUNNER_IMAGE = "zcoder-runner:latest";

function buildContainerScript(language, code, input) {
    const encodedCode = Buffer.from(code, "utf8").toString("base64");
    const encodedInput = Buffer.from(input ?? "", "utf8").toString("base64");

    if (language === "cpp") {
        return `
set -e
printf '%s' '${encodedCode}' | base64 -d > sol.cpp
printf '%s' '${encodedInput}' | base64 -d > input.txt
g++ -O2 -std=c++17 sol.cpp -o sol 2>compile.err || { cat compile.err >&2; exit 2; }
./sol < input.txt
`.trim();
    }

    if (language === "javascript") {
        return `
set -e
printf '%s' '${encodedCode}' | base64 -d > sol.js
printf '%s' '${encodedInput}' | base64 -d > input.txt
node sol.js < input.txt
`.trim();
    }

    if (language === "python") {
        return `
set -e
printf '%s' '${encodedCode}' | base64 -d > sol.py
printf '%s' '${encodedInput}' | base64 -d > input.txt
python3 sol.py < input.txt
`.trim();
    }

    throw new Error(`Unsupported language: ${language}`);
}

function runInDocker({ language, code, input = "", timeoutMs = 2000 }) {
    const script = buildContainerScript(language, code, input);

    const args = [
        "run",
        "--rm",
        "--network", "none",
        "--read-only",
        "--tmpfs", "/sandbox:rw,nosuid,exec,size=64m,uid=1000,gid=1000",
        "--memory", "256m",
        "--memory-swap", "256m",
        "--cpus", "0.5",
        "--pids-limit", "64",
        "-w", "/sandbox",
        RUNNER_IMAGE,
        "sh", "-c", script,
    ];

    return new Promise((resolve) => {
        const child = spawn("docker", args);
        let stdout = "";
        let stderr = "";
        let timedOut = false;

        const timer = setTimeout(() => {
            timedOut = true;
            child.kill("SIGKILL");
        }, timeoutMs);

        child.stdout.on("data", (chunk) => {
            stdout += chunk.toString();
        });

        child.stderr.on("data", (chunk) => {
            stderr += chunk.toString();
        });

        child.on("close", (exitCode) => {
            clearTimeout(timer);
            resolve({ stdout, stderr, exitCode, timedOut });
        });

        child.on("error", (err) => {
            clearTimeout(timer);
            resolve({
                stdout: "",
                stderr: err.message,
                exitCode: 1,
                timedOut: false,
            });
        });
    });
}

module.exports = { runInDocker };
