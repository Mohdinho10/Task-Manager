import { useState, useEffect } from "react";
import { useLoginMutation } from "../slices/userApiSlice";
import { useDispatch, useSelector } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import { useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import ClipLoader from "react-spinners/ClipLoader";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();
  const { userInfo } = useSelector((state) => state.auth);
  console.log(userInfo);

  useEffect(() => {
    if (userInfo) {
      // Redirect based on role
      if (userInfo.role === "admin") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    }
  }, [navigate, userInfo]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      toast.error("Please enter both email and password");
      return;
    }

    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials(res));
      toast.success("Login successful!");
      // navigation will happen in useEffect
    } catch (err) {
      toast.error(err?.data?.message || "Login failed");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="mx-auto w-full max-w-md rounded-xl bg-white p-8 shadow-2xl">
        <h2 className="mb-6 text-center text-3xl font-semibold text-blue-600">
          Welcome Back!
        </h2>
        <form onSubmit={submitHandler} className="space-y-5">
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
            className="w-full rounded-lg bg-blue-600 py-2 text-lg text-white hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          >
            {isLoading ? <ClipLoader color="white" size={24} /> : "Login"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="font-semibold text-blue-600 hover:text-blue-800"
          >
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
