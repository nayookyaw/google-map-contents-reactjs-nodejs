import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Users from "../pages/Users";
import Settings from "../pages/Settings";
import Locations from "../pages/Locations";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="/locations" element={<Locations />} />
    </Routes>
  );
}