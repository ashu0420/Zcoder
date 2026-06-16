// const problems = [
//   { id: 1, title: "Two Sum", difficulty: "Easy" },
//   { id: 2, title: "Binary Search", difficulty: "Easy" },
//   { id: 3, title: "Longest Substring", difficulty: "Medium" },
//   { id: 4, title: "Merge Intervals", difficulty: "Medium" },
//   { id: 5, title: "Word Ladder", difficulty: "Hard" },
// ];
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API_URL from "../config/api";
function Problems() {
  const [problems, setProblems] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [fav, setFav] = useState([]);
  const { token } = useAuth();
  const [showLoginMsg, setShowLoginMsg] = useState(false);
  const navigate = useNavigate();
  const filteredProblems = problems.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase())
  );
  const addToFav = async (pid) => {
    if (!token) {
      setShowLoginMsg(true);
      setTimeout(() => {
        navigate("/auth/signin");
        setShowLoginMsg(false);
      }, 500);
      return;
    }
    const res = await fetch(`${API_URL}/api/problems/fav/${pid}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )

    const data = await res.json();

    if (data.message === "Added") {
      setFav([...fav, pid]);
    } else {
      setFav(fav.filter((id) => id !== pid));
    }

  }
  useEffect(() => {
    const fetchProblems = async () => {
      try {
        const res = await fetch(`${API_URL}/api/problems`);

        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch problems");
        }
        setProblems(data);
      } catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }

    const fetchFav = async () => {
      try {
        const res = await fetch(`${API_URL}/api/problems/fav`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            }
          }
        );

        const data = await res.json();
        if (!res.ok) {
          throw new Error("Failed to fetch problems");
        }
        setFav(data || []);
      } catch (err) {
        setError(err.message);
      }
      finally {
        setLoading(false);
      }
    }
    fetchProblems();
    if (token) {
      fetchFav();
    }
  }, []);
  if (loading) return <h3>Loading Problems</h3>;
  if (error) return <h3>Error: {error}</h3>;
  return (
    <>
      <div style={{ padding: "20px" }}>
        <input
          type="text"
          placeholder="Search problems..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "10px",
            marginBottom: "20px",
            borderRadius: "8px",
            border: "1px solid #ccc"
          }}
        />
        <h2>Problems</h2>

        <div>
          {filteredProblems.map((p) => (
            <div
              key={p._id}
              style={{
                border: "1px solid #ddd",
                borderRadius: "8px",
                padding: "12px 16px",
                marginBottom: "12px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <Link
                to={`/problems/${p.slug}`}
                style={{
                  textDecoration: "none",
                  fontWeight: "600",
                  fontSize: "18px",
                  color: "#2563eb"
                }}
              >
                {p.title}
              </Link>

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
                        : "#fee2e2"
                }}
              >
                {p.difficulty}
              </span>
              {/* 
<button onClick={() => addToFav(p._id)}>
  {fav.includes(p._id)
    ? "Remove from favourites"
    : "Add to Favourites"}
</button>
*/}
            </div>
          ))}
        </div>
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
