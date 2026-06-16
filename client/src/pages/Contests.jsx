import { useEffect, useState } from "react";
import API_URL from "../config/api";

function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [platform, setPlatform] = useState("");

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch(`${API_URL}/api/contests`);
        const data = await res.json();

        setContests(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);
  const sortedContests = [...contests].sort(
    (a, b) =>
      new Date(a.startTime) - new Date(b.startTime)
  );
  const platformColors = {
    "codeforces.com": "#f97316",
    "codechef.com": "#92400e",
    "leetcode.com": "#eab308",
    "atcoder.jp": "#2563eb",
    "hackerrank.com": "#16a34a"
  };
  const filteredContests = sortedContests.filter(contest => {
    const matchesSearch =
      contest.name
        .toLowerCase()
        .includes(search.toLowerCase());

    const matchesPlatform =
      platform === "" ||
      contest.platform === platform;

    return matchesSearch && matchesPlatform;
  });
  if (loading) {
    return <h2 style={{ padding: "20px" }}>Loading contests...</h2>;
  }

  return (
    <div
      style={{
        maxWidth: "1000px",
        margin: "0 auto",
        padding: "20px"
      }}
    >
      <input
        placeholder="Search contests..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <select
        value={platform}
        onChange={(e) => setPlatform(e.target.value)}
      >
        <option value="">All Platforms</option>
        <option value="codeforces.com">Codeforces</option>
        <option value="codechef.com">CodeChef</option>
        <option value="leetcode.com">LeetCode</option>
        <option value="atcoder.jp">AtCoder</option>
      </select>
      <h1>
        🏆 Upcoming Contests
        <p style={{ color: "#666" }}>
          Showing {filteredContests.length}
          {filteredContests.length !== contests.length &&
            ` of ${contests.length}`}
          {" "} contests in the next 7 days
        </p>
      </h1>

      {contests.length === 0 ? (
        <p>No upcoming contests found.</p>
      ) : (
          
          filteredContests.map((contest) => {
          
            const diff =
              new Date(contest.startTime).getTime() - Date.now();

            const daysLeft = Math.floor(
              diff / (1000 * 60 * 60 * 24)
            );

            const hoursLeft = Math.floor(
              diff / (1000 * 60 * 60)
          );

          const startsIn =
            daysLeft > 0
              ? `${daysLeft} day${daysLeft > 1 ? "s" : ""}`
              : `${hoursLeft}h`;

          return (
            <div
              key={contest.id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "12px",
                padding: "20px",
                marginBottom: "20px",
                // background: "#fff",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                background: platformColors[contest.platform] || "#64748b",
                color: "white",
              }}
            >
              <h2 style={{ marginBottom: "12px" }}>
                {contest.name}
              </h2>

              <span
                style={{
                  background: "#eef2ff",
                  color: "#4338ca",
                  padding: "6px 12px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: "600"
                }}
              >
                {contest.platform}
              </span>

              <p style={{ marginTop: "15px" }}>
                📅{" "}
                {new Date(
                  contest.startTime
                ).toLocaleString("en-IN", {
                  dateStyle: "medium",
                  timeStyle: "short"
                })}
              </p>

              <p>
                ⏱ <b>Duration:</b>{" "}
                {contest.durationHours}h
              </p>

              <p>
                🚀 <b>Starts in:</b> {startsIn}
              </p>

              <a
                href={contest.link}
                target="_blank"
                rel="noreferrer"
                style={{
                  display: "inline-block",
                  marginTop: "10px",
                  background: "#2563eb",
                  color: "white",
                  padding: "10px 16px",
                  borderRadius: "8px",
                  textDecoration: "none",
                  fontWeight: "600"
                }}
              >
                Join Contest →
              </a>
            </div>
          );
        })
      )}
    </div>
  );
}

export default Contests;