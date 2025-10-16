import { onAuthStateChanged } from "firebase/auth";
import { useDispatch } from "react-redux";
import { useEffect } from "react";
import { getAuth } from "firebase/auth";
import app from "../firebase/firebase.config";
import { setCredentials, logout } from "../slices/authSlice";
import axios from "axios";

const auth = getAuth(app);

// ✅ Detect API base URL from env
const BASE_URL =
  import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

const AuthProvider = ({ children }) => {
  const dispatch = useDispatch();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          const { data } = await axios.post(
            `${BASE_URL}/jwt`,
            {
              email: currentUser.email,
              name: currentUser.displayName,
              photoURL: currentUser.photoURL,
            },
            { withCredentials: true },
          );

          // ✅ data.user now has MongoDB _id, etc.
          if (data?.success) {
            dispatch(setCredentials(data.user));
          } else {
            console.error("Failed to get user data from /jwt");
          }
        } catch (err) {
          console.error("Error fetching token:", err);
        }
      } else {
        dispatch(logout());
      }
    });

    return () => unsubscribe();
  }, [dispatch]);

  return children;
};

export default AuthProvider;
