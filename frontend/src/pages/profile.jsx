import { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          `https://social-networking-app-mu.vercel.app/api/user/${id}`
        );

        console.log("Profile API:", res.data);

        setUser(res.data.user);
      } catch (err) {
        console.error("Profile fetch error:", err);
      }
    };

    fetchUser();
  }, [id]);

  if (!user) return <p>Loading...</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>{user.name}</h2>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
      <p>Skills: {user.skills?.join(", ")}</p>
    </div>
  );
}

export default Profile;