import React, { useState } from "react";

import { ImCross } from "react-icons/im";
import { GiHamburgerMenu } from "react-icons/gi";
import { Link } from "react-router-dom";

function Navbar() {
  const [openNav, setOpenNav] = useState(false);

  const navLinks = (
    <ul className="flex flex-col lg:flex-row gap-6">
      <li>
        <Link to="/" className="text-white font-medium hover:text-gray-300 text-base">
          Home
        </Link>
      </li>
      <li>
        <Link to="/create-ticket" className="text-white font-medium hover:text-gray-300 text-base">
          Create Ticket
        </Link>
      </li>
    </ul>
  );

  return (
    <div className="sticky top-0 z-20 py-4 px-4 lg:px-8 shadow-lg bg-[#1E3A8A]">
      <div className="flex items-center justify-between">
      
        <Link to="/" className="text-xl font-semibold text-white whitespace-nowrap">
          Intelligent Help Desk
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

   
      {openNav && <div className="lg:hidden mt-4 py-4 px-4 bg-[#1e3a8a]">{navLinks}</div>}
    </div>
  );
}

export default Navbar;
