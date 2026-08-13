import { Fragment, useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import LoadingSpinner from "../../components/loadingSpinner";
import {
  FaYoutube,
  FaFacebook,
  FaWhatsapp,
} from "react-icons/fa";

export default function HomePage() {
  const [isLoading, setIsLoading] = useState(false);
  const [excoMembers, setExcoMembers] = useState([]);

  const roleMap = {
    president: "President",
    secretary: "Secretary",
    treasurer: "Treasurer",
    "coordinating-secretary": "Coordinating Secretary",
    "vice-president": "Vice President",
    "assistant-secretary": "Assistant Secretary",
    "assistant-treasurer": "Assistant Treasurer",
    "internal-auditor": "Internal Auditor",
    "committee-member": "Committee Member",
  };  

  const programs = [
    {
      id: "prog-1",
      title: "Annual Reunion",
      desc: "Connecting past students, sharing memories, and strengthening bonds.",
      image: "/images/reunion.jpg",
    },
    {
      id: "prog-2",
      title: "Community Service",
      desc: "Giving back to society through volunteering and social projects.",
      image: "/images/community.jpg",
    },
    {
      id: "prog-3",
      title: "Networking & Mentorship",
      desc: "Providing career guidance and mentorship to current students.",
      image: "/images/mentorship.jpg",
    },
  ];


  useEffect(() => {
    window.scrollTo(0, 0);
    setIsLoading(true);

    axios
      .get(import.meta.env.VITE_BACKEND_URL + "/api/member")
      .then((res) => {

        const data = res.data;

        const excoMembers = [
          data.find((m) => m.memberRole === "president") || {},
          data.find((m) => m.memberRole === "secretary") || {},
          data.find((m) => m.memberRole === "treasurer") || {},
          data.find((m) => m.memberRole === "coordinating-secretary") || {},
          data.find((m) => m.memberRole === "vice-president") || {},
          data.find((m) => m.memberRole === "assistant-secretary") || {},
          data.find((m) => m.memberRole === "assistant-treasurer") || {},
          data.find((m) => m.memberRole === "internal-auditor") || {},
          ...data.filter((m) => m.memberRole === "committee-member")
        ];

        setExcoMembers(excoMembers);
        setIsLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching members:", err);
        setIsLoading(false);
      });

  }, []);


  const navClass = ({ isActive }) =>
  isActive
    ? "text-yellow-400 border-b-2 border-yellow-400"
    : "hover:text-yellow-400";

  return (
    <Fragment>
      {/* ---------- HERO ---------- */}
      <section className="relative w-full min-h-screen flex items-start bg-black overflow-hidden">
        <motion.img
          src="/LandingPage1.jpg"
          alt="Tholangamuwa Central College Banner"
          className="absolute inset-0 w-full h-full object-cover pointer-events-none"
          initial={{ scale: 1.05 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        />

        <div className="absolute inset-0">
            <div className="relative z-30 flex items-center gap-4 sm:gap-8 px-4 sm:px-20 pt-20 sm:pt-10">
              {/* Logo */}
              <motion.img
                src="/NewLogoPng.png"
                alt="College Logo"
                className="w-16 h-16 sm:w-35 sm:h-35 object-contain"
              />

              {/* Text */}
              <div className="flex flex-col leading-tight">
                <h1 className="text-white text-base text-md sm:text-3xl font-bold drop-shadow-lg">
                  THOLANGAMUWA CENTRAL COLLEGE
                </h1>
                <h2 className="sm:mt-2 text-yellow-400 text-md sm:text-3xl font-semibold text-base drop-shadow-lg">
                  COLOMBO GROUP
                </h2>
              </div>
            </div>
        </div>

        <div className="relative z-10 px-8 max-w-xl mx-auto text-white mt-50 sm:mt-60 sm:ml-20">
          <motion.h1
            className="text-4xl sm:text-6xl font-bold drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Unity and Fellowship
          </motion.h1>
          <motion.p
            className="mt-8 text-lg sm:text-2xl drop-shadow-lg"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            Connecting Past Students of Tholangamuwa Central College in Colombo for Unity, Lifelong Bonds, and Mutual Support. 
          </motion.p>
        </div>

        {/* ---------- HERO CONTENT ---------- */}
        <div className="absolute mt-100 sm:bottom-25 left-20 w-full z-20 px-6 sm:px-20">
          <motion.div
            className="flex flex-col sm:flex-row sm:items-left sm:items-start gap-6 sm:gap-8 mt-32 sm:mt-48"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            <Link
              to="/register"
              className="px-12 py-3 bg-yellow-400 border border-yellow-200 text-white font-semibold rounded-xl shadow hover:bg-yellow-500 transition"
            >
              JOIN US
            </Link>

            <Link
              to="/about"
              className="px-8 py-3 bg-blue-600 text-white border border-yellow-200 font-semibold rounded-xl hover:bg-blue-800 transition"
            >
              LEARN MORE
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ---------- KEY PROGRAMS ---------- */}
      <section className="py-16 px-4 max-w-6xl mx-auto">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          OUR KEY PROGRAMS
        </h2>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {programs.map((prog, idx) => (
            <motion.div
              key={prog.id}
              className="bg-white rounded-2xl shadow hover:shadow-xl transition"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.2 }}
            >
              <img src={prog.image} alt={prog.title} className="h-48 w-full object-cover" />
              <div className="p-5">
                <h3 className="text-lg font-semibold">{prog.title}</h3>
                <p className="mt-2 text-sm text-gray-600">{prog.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ---------- MEMBERS ---------- */}
      <section className="py-16 px-4 bg-gray-50">
        <h2 className="text-2xl sm:text-3xl font-bold text-center mb-10">
          MEET OUR OFFICE BEARERS & EXECUTIVE COMMITTEE MEMBERS
        </h2>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <LoadingSpinner />
          </div>
        ) : (
          <div className="max-w-7xl mx-auto space-y-8">

            {/* First Row - 3 Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 justify-items-center">
              {excoMembers.slice(0, 3).map((m, index) => (
                <div
                  key={m._id || `${m.memberRole}-${index}`}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col items-center w-full max-w-sm"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={m.image[0] || "/userDefault.jpg"}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-600"
                  />
                  <h3 className="mt-4 font-bold text-center">
                    {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : "Not Assigned"}
                  </h3>
                  <p className="text-gray-600">{roleMap[m.memberRole] || m.memberRole}</p>
                </div>
              ))}
            </div>

            {/* Second Row - Remaining 5 Members */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 justify-items-center">
              {excoMembers.slice(3).map((m, index) => (
                <div
                  key={m._id || `${m.memberRole}-${index}`}
                  className="bg-white rounded-2xl shadow p-6 flex flex-col items-center w-full max-w-sm"
                >
                  <img
                    loading="lazy"
                    decoding="async"
                    src={m.image[0] || "/userDefault.jpg"}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover border-4 border-indigo-600"
                  />
                  <h3 className="mt-4 font-bold text-center">
                    {m.firstName && m.lastName ? `${m.firstName} ${m.lastName}` : "Not Assigned"}
                  </h3>
                  <p className="text-gray-600">{roleMap[m.memberRole] || m.memberRole}</p>
                </div>
              ))}
            </div>

          </div>
        )}
      </section>


      {/* ---------- CTA ---------- */}
      <section className="w-full py-16 px-4 bg-indigo-700 text-white text-center">
        <h2 className="text-2xl sm:text-4xl font-bold mb-4">
          JOIN OUR COMMUNITY
        </h2>

        <p className="max-w-2xl mx-auto mb-6 text-sm sm:text-base">
          Be part of a strong alumni network, attend events, share experiences,
          and maintain lifelong friendships.
        </p>

        <Link
          to="/register"
          className="inline-block px-8 py-3 bg-white text-indigo-700 font-semibold rounded-full shadow hover:bg-gray-100 transition"
        >
          Become a Member
        </Link>
      </section>


      {/* ---------- CONNECT WITH US ---------- */}
      <section className="w-full py-14 px-4 bg-gray-100">
        <div className="max-w-6xl mx-auto text-center">

          <motion.h2
            className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            CONNECT WITH US
          </motion.h2>

          <motion.p
            className="text-gray-600 mb-8 text-sm sm:text-base"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            Stay connected with the Tholangamuwa Central College Colombo Group
            through our social media and community channels.
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center items-center gap-5">

            {/* YouTube */}
            <motion.a
              href="https://www.youtube.com/@TCC--ColomboGroup"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-red-600 text-white rounded-xl shadow-md
                         hover:bg-red-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaYoutube className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  FOLLOW OUR
                </p>
                <p className="font-bold text-lg">
                  YouTube Channel
                </p>
              </div>
            </motion.a>


            {/* Facebook */}
            <motion.a
              href="https://www.facebook.com/groups/1477262159163235"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-blue-600 text-white rounded-xl shadow-md
                         hover:bg-blue-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaFacebook className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  FOLLOW OUR
                </p>
                <p className="font-bold text-lg">
                  Facebook Page
                </p>
              </div>
            </motion.a>


            {/* WhatsApp */}
            <motion.a
              // href="https://wa.me/YOUR_WHATSAPP_NUMBER"
              href="https://chat.whatsapp.com/GcBIDhnANgaBWfB5f8VjBR"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto min-w-[220px] flex items-center justify-center gap-3
                         px-6 py-4 bg-green-600 text-white rounded-xl shadow-md
                         hover:bg-green-700 hover:shadow-xl transition"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <FaWhatsapp className="text-3xl" />

              <div className="text-left">
                <p className="text-xs opacity-80">
                  JOIN OUR
                </p>
                <p className="font-bold text-lg">
                  WhatsApp Group
                </p>
              </div>
            </motion.a>

          </div>
        </div>
      </section>


      {/* ---------- FOOTER ---------- */}
      <footer className="w-full bg-gray-900 text-white py-8 px-4 text-center text-sm">
        <p>
          © 2025 Tholangamuwa Central College Past Students Colombo Group
        </p>

        <p className="opacity-75">
          Powered by nSoft Technologies
        </p>
      </footer>
    </Fragment>
  );
}
