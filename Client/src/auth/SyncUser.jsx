import React, { useEffect, useState } from "react";
import axios from "axios";

const SyncUser = ({ token }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const syncUser = async () => {
      if (!token) {
        setError("No token provided");
        return;
      }

      setLoading(true);
      setError(null);

      try {
        const response = await axios.post(
          "http://localhost:3000/api/users",
          {},
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.status === 200) {
          setUserData(response.data);
          console.log("✅ User synced:", response.data);
        } else {
          throw new Error(`Unexpected response status: ${response.status}`);
        }
      } catch (err) {
        console.error("❌ Sync error:", err);
        setError(err.response?.data?.message || err.message);
      } finally {
        setLoading(false);
      }
    };

    syncUser();
  }, [token]);
};

export default SyncUser;
