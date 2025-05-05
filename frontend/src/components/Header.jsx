import React, { useState } from "react";
import { ImCross } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link, useLocation } from "react-router-dom";
import Toggle from "../components/Toggle";
import { FaRobot } from "react-icons/fa";


function Navbar() {
  const [openNav, setOpenNav] = useState(false);
  const location = useLocation();

  const linkClass = (path) =>
    `text-white font-medium text-base pb-1 ${
      location.pathname === path ? "border-b-2 border-white" : "hover:text-gray-300"
    }`;

  const navLinks = (
    <ul className="flex flex-col lg:flex-row gap-6">
      <li>
        <Link to="/" className={linkClass("/")}>
          Home
        </Link>
      </li>
      <li>
        <Link to="/create-ticket" className={linkClass("/create-ticket")}>
          Create Ticket
        </Link>
      </li>
      <li>
        <Link to="/all-list" className={linkClass("/all-list")}>
          All Tickets
        </Link>
      </li>
      <li>
        <Toggle />
      </li>
    </ul>
  );

  return (
    <div className="sticky top-0 z-20 py-4 px-6 lg:px-12  shadow-lg bg-gradient-to-r from-blue-600 to-blue-800">
      <div className="flex items-center justify-between">
      <Link to="/" className="flex items-center space-x-2">
      <FaRobot color="white" size={26} />
      <span className="text-xl font-bold text-white">FixGen</span>
    </Link>

        <div className="flex items-center gap-8">
          <div className="hidden lg:flex">{navLinks}</div>
          <button
            onClick={() => setOpenNav(!openNav)}
            className="h-10 w-10 rounded-lg text-white lg:hidden focus:outline-none"
          >
            {openNav ? <ImCross size={22} /> : <GiHamburgerMenu size={22} />}
          </button>
        </div>
      </div>

      {openNav && <div className="lg:hidden mt-4 py-4 px-4 bg-blue-700 rounded-lg">{navLinks}</div>}
    </div>
  );
}

export default Navbar;
