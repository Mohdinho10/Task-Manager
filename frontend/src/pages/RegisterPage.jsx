import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import app from "../firebase/firebase.config";
import { motion } from "framer-motion";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import {
  useCreateUserMutation,
  useLazyGetUserByEmailQuery,
} from "../slices/userApiSlice";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from "firebase/auth";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

function RegisterPage() {
  const [createUserOnDB] = useCreateUserMutation();
  const [getUserByEmail] = useLazyGetUserByEmailQuery();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setIsUploading(true);
      setImageFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setTimeout(() => setIsUploading(false), 300);
    }
  };

  const removeImage = () => {
    setImageFile(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ✅ Register with email/password
  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email || !password || !confirmPassword) {
      toast.error("Please fill in all fields");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setIsLoading(true);

      // 1️⃣ Create user in Firebase
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      // 2️⃣ Prepare FormData for backend upload
      const formData = new FormData();
      formData.append("name", name);
      formData.append("email", email);
      formData.append("uid", cred.user.uid);
      if (imageFile) formData.append("profileImage", imageFile);

      // 3️⃣ Create in backend
      await createUserOnDB(formData).catch(() => {});

      // 4️⃣ Fetch full MongoDB user data
      const { data: dbUser } = await getUserByEmail(email);
      if (dbUser) {
        dispatch(setCredentials(dbUser));
        toast.success("Registration successful!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  // ✅ Google Register/Login
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;

      const userData = {
        name: user.displayName,
        email: user.email,
        profileImage: user.photoURL,
        uid: user.uid,
      };

      // Save or ignore if exists
      await createUserOnDB(userData).catch(() => {});

      // fetch full MongoDB user
      const { data: dbUser } = await getUserByEmail(user.email);
      console.log(dbUser);
      if (dbUser) {
        dispatch(setCredentials(dbUser));
        toast.success("Signed in with Google!");
        navigate("/");
      }
    } catch (err) {
      toast.error(err?.message || "Google sign-in failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-xl md:mt-6 md:py-2">
      <h2 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Create Account
      </h2>
      <form onSubmit={submitHandler} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Confirm Password
          </label>
          <input
            type="password"
            className="mt-1 w-full rounded-md border px-3 py-2 focus:border-blue-500 focus:outline-none"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Profile Image (Optional)
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            disabled={!!previewUrl}
            className={`block w-full text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:px-4 file:py-2 file:text-sm file:font-semibold ${
              previewUrl
                ? "cursor-not-allowed file:bg-gray-200 file:text-gray-400"
                : "cursor-pointer file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            }`}
          />

          {previewUrl && (
            <motion.div
              className="relative mt-3 h-24 w-24 overflow-visible"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={previewUrl}
                alt="Preview"
                className="h-full w-full rounded-full border-2 border-blue-300 object-cover"
              />
              <button
                type="button"
                onClick={removeImage}
                className="absolute top-0 right-0 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
                aria-label="Remove image"
              >
                <IoMdClose size={16} />
              </button>
            </motion.div>
          )}
        </div>

        <button
          type="submit"
          disabled={isUploading || isLoading}
          className={`w-full cursor-pointer rounded-md py-2 text-white transition ${
            isUploading || isLoading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isUploading || isLoading ? (
            <ClipLoader size={20} color="#fff" />
          ) : (
            "Register"
          )}
        </button>
      </form>

      <div className="my-6 flex items-center">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="mx-3 text-sm text-gray-500">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      {/* ✅ Google Sign Up Button */}
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-center gap-3 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm transition hover:bg-gray-50"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
      >
        {isLoading ? (
          <ClipLoader size={18} color="black" />
        ) : (
          <>
            <img
              src="https://authjs.dev/img/providers/google.svg"
              alt="Google logo"
              className="h-5 w-5"
            />
            Continue with Google
          </>
        )}
      </button>

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link
          to="/login"
          className="cursor-pointer text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
