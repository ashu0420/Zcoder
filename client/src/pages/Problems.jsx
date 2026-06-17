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
      <div style={{ padding: "20px" }}>
        {/* Filters */}
        <div
          style={{
            display: "flex",
            gap: "12px",
            flexWrap: "wrap",
            marginBottom: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search problems..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
              border: "1px solid #ccc",
              minWidth: "250px",
            }}
          />

          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
            }}
          >
            <option value="">All Difficulty</option>
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>

          <select
            value={tag}
            onChange={(e) => setTag(e.target.value)}
            style={{
              padding: "10px",
              borderRadius: "8px",
            }}
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
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
            }}
          >
            Clear
          </button>
          <button
            onClick={() => setShowFavOnly(!showFavOnly)}
            style={{
              padding: "10px 16px",
              borderRadius: "8px",
              cursor: "pointer",
              backgroundColor: showFavOnly ? "#facc15" : "#f3f4f6"
            }}
          >
            {showFavOnly ? "⭐ Favorites" : "☆ Favorites"}
          </button>
          {/* <select
            value={showFavOnly ? "fav" : "all"}
            onChange={(e) =>
              setShowFavOnly(e.target.value === "fav")
            }
          >
            <option value="all">All Problems</option>
            <option value="fav">Favorites</option>
          </select> */}
        </div>

        <h2>
          Problems ({displayedProblems.length})
        </h2>

        {displayedProblems.map((p) => (
          <div
            key={p._id}
            style={{
              border: "1px solid #ddd",
              borderRadius: "8px",
              padding: "14px",
              marginBottom: "12px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <Link
                to={`/problems/${p.slug}`}
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#2563eb",
                }}
              >
                {p.title}
              </Link>

              {/* Tags */}
              <div
                style={{
                  display: "flex",
                  gap: "6px",
                  flexWrap: "wrap",
                  marginTop: "8px",
                }}
              >
                {p.tags?.map((tag) => (
                  <span
                    key={tag}
                    style={{
                      padding: "3px 8px",
                      background: "#f3f4f6",
                      borderRadius: "6px",
                      fontSize: "12px",
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <span
                style={{
                  padding: "4px 10px",
                  borderRadius: "6px",
                  fontSize: "14px",
                  fontWeight: "500",
                  backgroundColor:
                    p.difficulty === "Easy"
                      ? "#dcfce7"
                      : p.difficulty === "Medium"
                        ? "#fef3c7"
                        : "#fee2e2",
                }}
              >
                {p.difficulty}
              </span>

              <button
                onClick={() => addToFav(p._id)}
                style={{
                  border: "none",
                  background: "transparent",
                  cursor: "pointer",
                  fontSize: "20px",
                }}
              >
                {fav.includes(p._id) ? "⭐" : "☆"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showLoginMsg && (
        <div className="login-popup">
          Please login first
        </div>
      )}
    </>
  );
}

export default Problems;