import { Outlet, NavLink } from "react-router-dom";

const navClass = ({ isActive }) =>
  isActive
    ? "text-yellow-400 border-b-2 border-yellow-400"
    : "hover:text-yellow-400";

export default function MainLayout() {
  return (
    <>
      {/* NAVBAR */}
      <nav className="fixed top-24 right-14 z-50 flex gap-6 text-white text-sm sm:text-xl font-semibold">
        <NavLink to="/" end className={navClass}>
          Home
        </NavLink>

        <NavLink to="/about" className={navClass}>
          About Us
        </NavLink>

        <NavLink to="/contact" className={navClass}>
          Contact Us
        </NavLink>

        <NavLink
          to="/login"
          className={({ isActive }) =>
            isActive
              ? "px-4 py-1 bg-yellow-400 text-black rounded-lg"
              : "px-4 py-1 border border-yellow-400 rounded-lg hover:bg-yellow-400 hover:text-black"
          }
        >
          Login
        </NavLink>
      </nav>

      {/* PAGE CONTENT */}
      <Outlet />
    </>
  );
}
