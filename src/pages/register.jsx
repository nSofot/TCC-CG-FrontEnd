import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { useGoogleLogin } from "@react-oauth/google";
import { FcGoogle } from "react-icons/fc";

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [title, setTitle] = useState("Mr.");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mobile, setMobile] = useState("");
  const [email, setEmail] = useState("");
  const [invitee, setInvitee] = useState("");
  const [inviteeId, setInviteeId] = useState("");
  const [inviteeMobile, setInviteeMobile] = useState("");
  const [inputMobile, setInputMobile] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();

  const searchCustomer = async (id) => {
    if (!id || id === "0") return;
    setIsLoading(true);
    try {
      const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/member/${id}`);
      if (res.data) {
        setInviteeId(res.data.memberId || "");
        setInvitee(`${res.data.title || ""} ${res.data.firstName || ""} ${res.data.lastName || ""}`.trim());
        setInviteeMobile(res.data.mobile || "");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Invalid Member ID");
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async () => {
    if (!firstName || !lastName || !mobile || !inputMobile || !inviteeMobile || !password || !confirmPassword) {
      toast.error("Please fill in all required fields");
      return;
    }
    if (inputMobile !== inviteeMobile) {
      toast.error("Invitee mobile numbers do not match");
      return;
    }
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    const newMember = {
      title,
      firstName,
      lastName,
      mobile,
      email: email ? email.trim() : undefined,
      password,
      invitedBy: inviteeId || null,
      memberType: "guest",
      memberRole: "guest",
      periodInSchoolFrom: currentYear,
      periodInSchoolTo: currentYear,
      address: [],
      notes: "",
      image: [],
      phone: "",
    };

    try {
      setIsRegistering(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/member`, newMember);
      toast.success("Registration Successful");
      navigate("/member-profile");
    } catch (err) {
      console.error("Register error:", err);
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsRegistering(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (response) => {
      if (!inputMobile || !inviteeMobile) {
        toast.error("Please provide invitee ID and invitee mobile before Google registration");
        return;
      }
      try {
        const accessToken = response.access_token;
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/user/create-google`, {
          accessToken,
          invitedBy: inviteeId,
          mobile,
        });
        toast.success("Google Registration Successful");
        localStorage.setItem("token", res.data.token);
        navigate("/member-profile");
      } catch (err) {
        toast.error(err.response?.data?.message || "Google registration failed");
      }
    },
    onError: () => toast.error("Google registration failed"),
  });

  return (
    <div className="min-h-screen w-full bg-[url('/LandingImageNew.jpg')] bg-cover bg-center flex justify-center items-center px-4 py-6">
      <div className="w-full max-w-lg sm:max-w-xl md:max-w-2xl bg-white/40 backdrop-blur-md rounded-2xl shadow-2xl flex flex-col gap-4 p-6 sm:p-8">
        <h2 className="text-2xl sm:text-3xl font-semibold text-purple-600 text-center mb-6">
          Register New Account
        </h2>

        {/* Invitee Row */}
        <div className="flex flex-col justify-between sm:flex-row gap-2">
          <input
            type="number"
            placeholder="Invitee ID"
            maxLength={4}
            value={inviteeId}
            onChange={async (e) => {
              const value = e.target.value;
              setInviteeId(value);
              if (value.length === 4) await searchCustomer(value);
            }}
            className="sm:w-[120px] h-10 px-3 rounded-md border bg-green-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Invitee Name"
            disabled
            value={invitee}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
          <input
            type="text"
            placeholder="Invitee Mobile"
            value={inputMobile}
            onChange={(e) => setInputMobile(e.target.value)}
            className="sm:w-[130px] h-10 px-3 rounded-md border bg-green-50 focus:outline-none focus:ring-2 focus:ring-purple-400"
          />
        </div>

        {/* Name Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <select value={title} onChange={(e) => setTitle(e.target.value)} className="h-10 px-2 rounded-md border bg-green-50">
            <option>Mr.</option>
            <option>Mrs.</option>
            <option>Miss.</option>
            <option>Dr.</option>
            <option>Prof.</option>
          </select>
          <input
            type="text"
            placeholder="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
          <input
            type="text"
            placeholder="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
        </div>

        {/* Mobile & Email Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="Mobile"
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
        </div>

        {/* Password Row */}
        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
          <input
            type="password"
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="flex-1 h-10 px-3 rounded-md border bg-green-50"
          />
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-2 mt-4">
          <button
            onClick={handleRegister}
            disabled={isRegistering}
            className={`flex-1 h-10 text-white bg-purple-600 rounded-md ${isRegistering ? "opacity-50 cursor-not-allowed" : "hover:bg-purple-700"}`}
          >
            {isRegistering ? "Registering..." : "Register"}
          </button>
          <button
            onClick={googleLogin}
            className="flex-1 h-10 flex items-center justify-center gap-2 text-purple-600 border border-purple-600 rounded-md hover:bg-purple-700 hover:text-white"
          >
            <FcGoogle className="text-2xl" />
            Register with Google
          </button>
        </div>
      </div>
    </div>
  );
}
