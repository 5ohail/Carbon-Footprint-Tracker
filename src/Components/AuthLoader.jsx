// AuthLoader.jsx
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/Firebase";
import { useData } from "../utils/DataProvider";

const AuthLoader = () => {
  const { fetchData } = useData();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchData(user.uid); // ✅ Fetch user-specific data
      }
    });

    return () => unsubscribe();
  }, []);

  return null; // This component doesn't render UI
};

export default AuthLoader;
