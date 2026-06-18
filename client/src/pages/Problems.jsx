import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";

function Problems() {
  const [problems, setProblems] = useState([]);
  const [difficulty, setDifficulty] = useState("");
  const [tag, setTag] = useState("");
  const [search, setSearch] = useState("");
  const [tags, setTags] = useState([]);
  const [fav, setFav] = useState([]);
  const [showFavOnly, setShowFavOnly] = useState(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [showLoginMsg, setShowLoginMsg] = useState(false);

  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await fetch(`${API_URL}/api/problems/tags/all`);
        const data = await res.json();
        setTags(data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchTags();
  }, []);


  useEffect(() => {
    const fetchProblems = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams();

        if (difficulty) params.append("difficulty", difficulty);
        if (tag) params.append("tag", tag);
        if (search) params.append("search", search);

        const res = await fetch(
          `${API_URL}/api/problems?${params.toString()}`
        );

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.message || "Failed to fetch problems");
        }

        setProblems(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    const fetchFav = async () => {
      try {
        const res = await fetch(`${API_URL}/api/problems/fav`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) return;

        const data = await res.json();
        setFav(data || []);
      } catch (err) {
        console.log(err);
      }
    };

    fetchProblems();

    if (token) {
      fetchFav();
    }
  }, [difficulty, tag, search, token]);
  const displayedProblems = showFavOnly
    ? problems.filter((p) => fav.includes(p._id))
    : problems;
  const addToFav = async (pid) => {
    if (!token) {
      setShowLoginMsg(true);

      setTimeout(() => {
        setShowLoginMsg(false);
        navigate("/auth/signin");
      }, 800);

      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/api/problems/fav/${pid}`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();

      if (data.message === "Added") {
        setFav((prev) => [...prev, pid]);
      } else {
        setFav((prev) =>
          prev.filter((id) => id !== pid)
        );
      }
    } catch (err) {
      console.log(err);
    }
  };

  if (loading) return <h3>Loading Problems...</h3>;

  if (error) return <h3>Error: {error}</h3>;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-6">
        {/* Filters */}
        <div className="sticky top-16 z-10 bg-white border rounded-xl p-4 shadow-sm mb-6">
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search problems..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 min-w-[250px] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">All Difficulty</option>
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>

            <select
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              className="px-4 py-2 border rounded-lg bg-white"
            >
              <option value="">All Tags</option>

              {tags.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>

            <button
              onClick={() => {
                setSearch("");
                setDifficulty("");
                setTag("");
              }}
              className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 transition"
            >
              Clear
            </button>

            <button
              onClick={() => setShowFavOnly(!showFavOnly)}
              className={`px-4 py-2 rounded-lg transition font-medium ${showFavOnly
                  ? "bg-yellow-400 text-black"
                  : "bg-gray-100 hover:bg-gray-200"
                }`}
            >
              {showFavOnly ? "⭐ Favorites" : "☆ Favorites"}
            </button>
          </div>
        </div>

        {/* Heading */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-2xl font-bold">
            Problems
          </h2>

          <span className="px-3 py-1 rounded-full bg-blue-100 text-blue-700 font-medium">
            {displayedProblems.length} Problems
          </span>
        </div>

        {/* Problem List */}
        <div className="space-y-4">
          {displayedProblems.map((p) => (
            <div
              key={p._id}
              className="bg-white border rounded-xl p-5 hover:shadow-md transition duration-200"
            >
              <div className="flex justify-between items-start gap-4">
                {/* Left */}
                <div className="flex-1">
                  <Link
                    to={`/problems/${p.slug}`}
                    className="text-lg md:text-xl font-semibold text-blue-600 hover:text-blue-800"
                  >
                    {p.title}
                  </Link>

                  <div className="flex flex-wrap gap-2 mt-3">
                    {p.tags?.map((tag) => (
                      <span
                        key={tag}
                        className="px-2 py-1 text-xs rounded-md bg-gray-100 text-gray-700"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right */}
                <div className="flex items-center gap-3">
                  <span
                    className={`px-3 py-1 rounded-lg text-sm font-semibold ${p.difficulty === "Easy"
                        ? "bg-green-100 text-green-700"
                        : p.difficulty === "Medium"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                  >
                    {p.difficulty}
                  </span>

                  <button
                    onClick={() => addToFav(p._id)}
                    className="text-2xl hover:scale-110 transition"
                  >
                    {fav.includes(p._id) ? "⭐" : "☆"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {displayedProblems.length === 0 && (
          <div className="text-center py-16 text-gray-500">
            No problems found.
          </div>
        )}
      </div>

      {showLoginMsg && (
        <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-lg shadow-lg">
          Please login first
        </div>
      )}
    </>
  );
}

export default Problems;