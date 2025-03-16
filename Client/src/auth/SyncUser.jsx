import { useEffect } from "react";
import axios from "axios";
import { useUser, useAuth } from "@clerk/clerk-react";

const SyncUser = () => {
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  useEffect(() => {
    async function syncUser() {
      if (!isLoaded || !user) return;

      try {
        const token = await getToken();
        
        // ✅ Fetch role from Clerk metadata
        const role = user.unsafeMetadata.role || "user"; // Default to 'user' if undefined

        const userData = {
          clerkId: user.id,
          name: user.fullName,
          email: user.primaryEmailAddress?.emailAddress,
          avatar: user.imageUrl,
          role,  // ✅ Send correct role (user OR mentor)
        };

        await axios.post(
          "http://localhost:3000/api/users",
          userData,
          {
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        console.log("✅ User synced:", userData);
      } catch (error) {
        console.error("❌ Sync error:", error);
      }
    }

    syncUser();
  }, [user, isLoaded, getToken]);

  return null;
};

export default SyncUser;
