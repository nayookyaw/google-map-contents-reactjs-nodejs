import { NavLink } from "react-router-dom";

export default function Sidebar() {
  return (
    <aside className="sidebar relative flex flex-col h-screen w-64 bg-[#0f1420] text-white">
      {/* Header + Nav */}
      <div className="p-4 ">
        <h2 className="mb-6 text-lg font-bold">Map App</h2>
        <nav className="flex flex-col gap-3">
          <NavLink to="/" end className={({ isActive }) => (isActive ? "active" : "")}>
            Home
          </NavLink>
          <NavLink to="/users" className={({ isActive }) => (isActive ? "active" : "")}>
            Users
          </NavLink>
          <NavLink to="/locations" className={({ isActive }) => (isActive ? "active" : "")}>
            Locations
          </NavLink>
          <NavLink to="/settings" className={({ isActive }) => (isActive ? "active" : "")}>
            Settings
          </NavLink>
        </nav>
      </div>

      {/* Footer sticks to bottom */}
      <hr className="border-gray-700 my-2" />
      <footer className="left-0 w-full p-70 text-xs text-gray-400 border-t border-gray-700">
        Developed by <span className="font-semibold">Nay Oo Kyaw</span>
      </footer>
    </aside>
  );
}