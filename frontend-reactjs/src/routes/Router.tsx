import { Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Users from "../pages/Users";
import Settings from "../pages/Settings";

export default function Router() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/users" element={<Users />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  );
}