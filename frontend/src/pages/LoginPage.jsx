import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, Link } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import app from "../firebase/firebase.config";
import { setCredentials } from "../slices/authSlice";
import {
  useCreateUserMutation,
  useLazyGetUserByEmailQuery,
} from "../slices/userApiSlice";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [createUserOnDB] = useCreateUserMutation();
  const [getUserByEmail] = useLazyGetUserByEmailQuery();

  // 🔹 Email/password login
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      setIsLoading(true);
      const cred = await signInWithEmailAndPassword(auth, email, password);

      // ensure exists in DB
      await createUserOnDB({
        name: cred.user.displayName || "",
        email: cred.user.email,
        uid: cred.user.uid,
        profileImage: cred.user.photoURL || "",
      }).catch(() => {}); // ignore "already exists"

      // 🔹 fetch from DB to get full object (_id, role, etc.)
      const { data: dbUser } = await getUserByEmail(cred.user.email);
      if (dbUser) {
        dispatch(setCredentials(dbUser));
        toast.success("Login successful!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Login failed:", err);
      toast.error(err?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  // 🔹 Google login
  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      // ensure exists in DB
      await createUserOnDB({
        name: user.displayName,
        email: user.email,
        uid: user.uid,
        profileImage: user.photoURL,
      }).catch(() => {});

      // fetch full user from DB
      const { data: dbUser } = await getUserByEmail(user.email);
      if (dbUser) {
        dispatch(setCredentials(dbUser));
        toast.success("Login with Google successful!");
        navigate("/", { replace: true });
      }
    } catch (err) {
      console.error("Google login failed:", err);
      toast.error("Google login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-semibold text-blue-600">
          Welcome Back!
        </h2>
        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label
              htmlFor="email"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="mb-1 block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={isLoading}
            className="w-full cursor-pointer rounded-lg bg-blue-600 py-2 text-lg text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {isLoading ? <ClipLoader color="white" size={24} /> : "Login"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-sm text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Login Button */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        >
          <img
            src="https://authjs.dev/img/providers/google.svg"
            alt="Google logo"
            className="h-5 w-5"
          />
          Continue with Google
        </button>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don&apos;t have an account?{" "}
          <Link
            to="/register"
            className="cursor-pointer font-semibold text-blue-600 hover:text-blue-800"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
