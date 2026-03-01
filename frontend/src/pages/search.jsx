import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Search() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    try {
      const res = await axios.get(
        `https://social-networking-app-mu.vercel.app/api/user?search=${search}`
      );

      setUsers(res.data.users);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Search Users</h2>

      <input
        type="text"
        placeholder="Search username..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      <button onClick={handleSearch}>Search</button>

      <ul>
        {users.map((user) => (
          <li
            key={user._id}
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            {user.name}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Search;