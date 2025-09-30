import { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { setCredentials } from "../slices/authSlice";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import ClipLoader from "react-spinners/ClipLoader";
import { IoMdClose } from "react-icons/io";

import {
  useGetUserProfileQuery,
  useUpdateUserProfileMutation,
} from "../slices/userApiSlice";
import CharAvatar from "../components/CharAvatar";
import { BASE_URL } from "../constants";

const availabilityOptions = ["online", "offline", "busy", "on leave"];

function ProfilePage() {
  const dispatch = useDispatch();
  const fileInputRef = useRef(null);

  const { data: profile } = useGetUserProfileQuery();
  const [updateProfile, { isLoading }] = useUpdateUserProfileMutation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [availability, setAvailability] = useState("offline");
  const [profileImage, setProfileImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState("");

  // ✅ Populate form with existing profile
  useEffect(() => {
    if (profile) {
      setName(profile.name || "");
      setEmail(profile.email || "");
      setPhone(profile.phone || "");
      setAvailability(profile.availability || "offline");
      setPreviewUrl(
        profile.profileImageUrl
          ? `${BASE_URL}${profile.profileImageUrl.replace("public", "")}`
          : "",
      );
    }
  }, [profile]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setProfileImage(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const removeImage = () => {
    setProfileImage(null);
    setPreviewUrl(
      profile?.profileImageUrl
        ? `${BASE_URL}${profile.profileImageUrl.replace("public", "")}`
        : "",
    );
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    if (!name || !email) {
      toast.error("Name and Email are required");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("availability", availability);
    if (profileImage) formData.append("profileImage", profileImage);

    try {
      const updatedUser = await updateProfile(formData).unwrap();
      dispatch(setCredentials(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err?.data?.message || "Update failed");
    }
  };

  return (
    <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-xl md:mt-6">
      <h2 className="mb-6 text-center text-3xl font-bold text-blue-600">
        Update Profile
      </h2>

      {/* Profile Image */}
      <div className="mb-6 flex justify-center">
        <div className="relative">
          {previewUrl ? (
            <motion.img
              src={previewUrl}
              alt="Profile"
              className="h-28 w-28 rounded-full border-2 border-blue-300 object-cover shadow-md"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4 }}
            />
          ) : (
            <CharAvatar
              username={name}
              width="w-28"
              height="h-28"
              style="text-2xl"
            />
          )}
          {previewUrl && (
            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:bg-red-700"
            >
              <IoMdClose size={16} />
            </button>
          )}
        </div>
      </div>

      <form onSubmit={submitHandler} className="space-y-5">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Full Name
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Phone
          </label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border px-3 py-2 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>

        {/* Availability Dropdown */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Availability
          </label>
          <select
            className="mt-1 w-full rounded-md border px-3 py-2 capitalize outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
            value={availability}
            onChange={(e) => setAvailability(e.target.value)}
          >
            {availabilityOptions.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status}
              </option>
            ))}
          </select>
        </div>

        {/* Upload new image */}
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Update Profile Image
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="block w-full cursor-pointer text-sm text-gray-500 file:mr-4 file:rounded-full file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full cursor-pointer rounded-md py-2 text-white transition ${
            isLoading
              ? "cursor-not-allowed bg-blue-400"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
        >
          {isLoading ? <ClipLoader size={20} color="#fff" /> : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

export default ProfilePage;
