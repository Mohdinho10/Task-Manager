// import { onAuthStateChanged } from "firebase/auth";
// import { useDispatch } from "react-redux";
// import { useEffect } from "react";
// import { getAuth } from "firebase/auth";
// import app from "../firebase/firebase.config";
// import { setCredentials, logout } from "../slices/authSlice";
// import axios from "axios";

// const auth = getAuth(app);

// // ✅ Detect API base URL from env
// const BASE_URL =
//   import.meta.env.MODE === "development" ? "http://localhost:3000" : "";

// const AuthProvider = ({ children }) => {
//   const dispatch = useDispatch();

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
//       if (currentUser) {
//         const userInfo = {
//           displayName: currentUser.displayName,
//           email: currentUser.email,
//           uid: currentUser.uid,
//         };

//         try {
//           // ✅ Call the right backend depending on env
//           await axios.post(
//             `${BASE_URL}/jwt`,
//             { email: currentUser.email },
//             { withCredentials: true },
//           );

//           dispatch(setCredentials(userInfo));
//         } catch (err) {
//           console.error("Error fetching token:", err);
//         }
//       } else {
//         dispatch(logout());
//       }
//     });

//     return () => unsubscribe();
//   }, [dispatch]);

//   return children;
// };

// export default AuthProvider;
