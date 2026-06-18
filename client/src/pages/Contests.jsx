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
    <div className="max-w-6xl mx-auto px-4 md:px-8 py-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold flex items-center gap-3">
          🏆 Upcoming Contests
        </h1>

        <p className="text-gray-500 mt-2">
          Showing {filteredContests.length}
          {filteredContests.length !== contests.length &&
            ` of ${contests.length}`}
          {" "}contests in the next 7 days
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white border rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-wrap gap-3">
          <input
            placeholder="Search contests..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 min-w-[250px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <select
            value={platform}
            onChange={(e) => setPlatform(e.target.value)}
            className="px-4 py-2 border rounded-lg bg-white"
          >
            <option value="">All Platforms</option>
            <option value="codeforces.com">Codeforces</option>
            <option value="codechef.com">CodeChef</option>
            <option value="leetcode.com">LeetCode</option>
            <option value="atcoder.jp">AtCoder</option>
          </select>

          <button
            onClick={() => {
              setSearch("");
              setPlatform("");
            }}
            className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Clear
          </button>
        </div>
      </div>

      {/* Contest List */}
      {filteredContests.length === 0 ? (
        <div className="bg-white border rounded-xl p-10 text-center text-gray-500">
          No contests found.
        </div>
      ) : (
        <div className="grid gap-5">
          {filteredContests.map((contest) => {
            const diff =
              new Date(contest.startTime).getTime() -
              Date.now();

            const daysLeft = Math.floor(
              diff / (1000 * 60 * 60 * 24)
            );

            const hoursLeft = Math.floor(
              diff / (1000 * 60 * 60)
            );

            const startsIn =
              daysLeft > 0
                ? `${daysLeft} day${daysLeft > 1 ? "s" : ""
                }`
                : `${hoursLeft}h`;

            const platformName = {
              "codeforces.com": "Codeforces",
              "codechef.com": "CodeChef",
              "leetcode.com": "LeetCode",
              "atcoder.jp": "AtCoder",
              "hackerrank.com": "HackerRank",
            };

            const badgeColor = {
              "codeforces.com":
                "bg-orange-100 text-orange-700",
              "codechef.com":
                "bg-amber-100 text-amber-700",
              "leetcode.com":
                "bg-yellow-100 text-yellow-700",
              "atcoder.jp":
                "bg-blue-100 text-blue-700",
              "hackerrank.com":
                "bg-green-100 text-green-700",
            };

            return (
              <div
                key={contest.id}
                className="bg-white border rounded-2xl p-6 shadow-sm hover:shadow-lg transition"
              >
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">
                      {contest.name}
                    </h2>

                    <div className="flex flex-wrap items-center gap-2 mt-3">
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium ${badgeColor[
                          contest.platform
                          ] ||
                          "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {platformName[
                          contest.platform
                        ] || contest.platform}
                      </span>

                      <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium">
                        Starts in {startsIn}
                      </span>
                    </div>
                  </div>

                  <a
                    href={contest.link}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl font-semibold text-center"
                  >
                    Join Contest →
                  </a>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5 pt-5 border-t">
                  <div>
                    <p className="text-sm text-gray-500">
                      Start Time
                    </p>
                    <p className="font-medium">
                      {new Date(
                        contest.startTime
                      ).toLocaleString(
                        "en-IN",
                        {
                          dateStyle: "medium",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Duration
                    </p>
                    <p className="font-medium">
                      {contest.durationHours} Hours
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Contests;