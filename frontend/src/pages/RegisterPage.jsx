import { useState, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import ClipLoader from "react-spinners/ClipLoader";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useRegisterMutation } from "../slices/userApiSlice";
import { IoMdClose } from "react-icons/io";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";

function RegisterPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isUploading, setIsUploading] = useState(false);

  const fileInputRef = useRef(null); // to reset file input

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [register, { isLoading }] = useRegisterMutation();

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
      fileInputRef.current.value = ""; // reset input field
    }
  };

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

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("password", password);
    if (imageFile) formData.append("profileImage", imageFile);

    try {
      const res = await register(formData).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Registration successful!");
      navigate("/");
    } catch (err) {
      toast.error(err?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-xl md:mt-6 md:py-2">
      {/* "mx-auto mt-6 max-w-md rounded-lg bg-white px-8 py-2 shadow-xl" */}
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
            disabled={!!previewUrl} // disable if image exists
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

      <p className="mt-4 text-center text-sm text-gray-600">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}

export default RegisterPage;
