import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgetPasswordPage() {
  const [otpSent, setOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [userId, setUserId] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const navigate = useNavigate();

  // ================= SEND OTP =================
  async function sendOtp() {
    if (!email || !userId) {
      toast.error("Email and User ID are required");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/send-OTP`,
        {
          email,
          mobile,
          memberId: userId,
        }
      );

      setOtpSent(true);
      toast.success("OTP sent to your email. Check your inbox.");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Failed to send OTP");
    }
  }

  // ================= VERIFY OTP & RESET PASSWORD =================
  async function verifyOtp() {
    if (!userId) {
      toast.error("User ID is required");
      return;
    }

    if (!otp) {
      toast.error("OTP is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const otpNumber = parseInt(otp.trim(), 10);
    if (isNaN(otpNumber)) {
      toast.error("Please enter a valid numeric OTP");
      return;
    }

    try {
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/user/reset-password`,
        {
          email,
          memberId: userId,
          otp: otpNumber,
          newPassword,
        }
      );

      toast.success("Password reset successfully");
      navigate("/login");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Invalid or expired OTP");
    }
  }

  // ================= RESEND OTP =================
  function handleResend() {
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setOtpSent(false);
  }

  return (
    <div className="min-h-screen w-full bg-[url('/LandingImageNew.jpg')] bg-cover bg-center flex items-center justify-center p-4">
      <div className="flex flex-col md:flex-row items-center gap-8 max-w-5xl w-full">
        <div className="w-full md:w-1/2 p-6 md:p-10 backdrop-blur-md bg-white/40 rounded-2xl shadow-xl">
          <h2 className="text-2xl md:text-3xl font-bold text-purple-700 mb-6 text-center">
            {otpSent ? "Reset Password" : "Forgot Password"}
          </h2>

          {!otpSent ? (
            <>
              <input
                type="text"
                placeholder="Enter your User ID"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="w-full h-12 px-4 mb-4 rounded-lg border border-purple-200 bg-white"
              />

              <input
                type="text"
                placeholder="Enter your mobile number"
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                className="w-full h-12 px-4 mb-4 rounded-lg border border-purple-200 bg-white"
              />

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full h-12 px-4 mb-6 rounded-lg border border-purple-200 bg-white"
              />

              <button
                onClick={sendOtp}
                className="w-full h-12 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg"
              >
                Send OTP
              </button>
            </>
          ) : (
            <>
              <input
                type="text"
                readOnly
                value={userId}
                className="w-full h-12 px-4 mb-4 rounded-lg border border-purple-200 bg-gray-100"
              />

              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full h-12 px-4 mb-4 rounded-lg border border-purple-200 bg-white"
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full h-12 px-4 mb-4 rounded-lg border border-purple-200 bg-white"
              />

              <input
                type="password"
                placeholder="Confirm New Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full h-12 px-4 mb-6 rounded-lg border border-purple-200 bg-white"
              />

              <button
                onClick={verifyOtp}
                className="w-full h-12 text-white font-semibold bg-purple-600 hover:bg-purple-700 rounded-lg mb-3"
              >
                Reset Password
              </button>

              <button
                onClick={handleResend}
                className="w-full h-12 text-purple-700 font-semibold border border-purple-600 hover:bg-purple-700 hover:text-white rounded-lg"
              >
                Resend OTP
              </button>
            </>
          )}

          <p className="mt-8 text-sm text-gray-600 text-center">
            © 2025 Tholangamuwa Central College - Colombo Group
          </p>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Powered by nSoft Technologies
          </p>
        </div>
      </div>
    </div>
  );
}
