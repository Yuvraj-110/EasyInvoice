import { useSearchParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";

export default function VerifyPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();
  const [status, setStatus] = useState("verifying"); 
  // can be: verifying, success, failed

  useEffect(() => {
    const verify = async () => {
      try {
        await axios.get(`/api/auth/verify?token=${token}`);
        setStatus("success");
        toast.success("Email verified successfully!");
        navigate("/auth");
      } catch (err) {
        setStatus("failed");
        console.error("❌ Verification error:", err);
        toast.error("Invalid or expired verification link.");
      }
    };
    if (token) verify();
    else setStatus("failed");
  }, [token, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white dark:bg-gray-800 p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">
          {status === "verifying"
            ? "Verifying..."
            : status === "success"
            ? "Email Verified 🎉"
            : "Verification Failed"}
        </h2>
        <p className="text-gray-600 dark:text-gray-300">
          {status === "verifying"
            ? "Please wait while we verify your email."
            : status === "success"
            ? "Redirecting you to login page..."
            : "This verification link is invalid or has expired."}
        </p>
      </div>
    </div>
  );
}
