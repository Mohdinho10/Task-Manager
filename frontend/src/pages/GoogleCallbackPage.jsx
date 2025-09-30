import { useEffect } from "react";
import { useUser } from "@clerk/clerk-react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useRegisterMutation, useLoginMutation } from "../slices/userApiSlice";
import { setCredentials } from "../slices/authSlice";

function GoogleCallbackPage() {
  const { user, isLoaded } = useUser(); // useUser() now works after redirect
  const [register] = useRegisterMutation();
  const [login] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Wait until Clerk loads the user after redirect
    if (!isLoaded || !user) return;

    const syncUser = async () => {
      const email = user.primaryEmailAddress?.emailAddress;
      const name = user.fullName;
      const imageUrl = user.imageUrl;

      if (!email) return;

      try {
        // Try login first
        const res = await login({ email, isGoogleLogin: true }).unwrap();
        dispatch(setCredentials(res));
        navigate("/", { replace: true });
      } catch {
        // If login fails, register user
        const res = await register({
          name,
          email,
          profileImageUrl: imageUrl,
          password: null,
        }).unwrap();
        dispatch(setCredentials(res));
        navigate("/", { replace: true });
      }
    };

    syncUser();
  }, [isLoaded, user]);

  return <p>Finishing login...</p>;
}

export default GoogleCallbackPage;
