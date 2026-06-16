import { useEffect, useState } from "react";
import API_URL from "../config/api";
function Contests() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchContests = async () => {
      try {
        const res = await fetch(`${API_URL}api/contests`); // your backend route
        const data = await res.json();

        const formatted = data.map(c => ({
          id: c.id,
          name: c.event,
          startTime: new Date(c.start),
          duration: Math.floor(c.duration / 3600),
          platform: c.resource.name,
          url: c.href,
        }));

        setContests(formatted);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContests();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h2>Upcoming Contests</h2>

      {contests.map(c => (
        <div key={c.id} style={{ marginBottom: "10px" }}>
          <a href={c.url} target="_blank" rel="noreferrer">
            <b>{c.name}</b>
          </a>
          <div>
            {c.platform} — {c.startTime.toLocaleString()} — {c.duration}h
          </div>
        </div>
      ))}
    </div>
  );
}

export default Contests;