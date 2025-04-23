import React from 'react';
import { IoMdClose } from "react-icons/io";
import { MdDone } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

function TicketPopup() {
  const navigate = useNavigate();

  const handleOkClick = () => {
    navigate('/all-list');
  };

  const handleCloseClick = () => {
    navigate('/all-list');
  };

  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-white/30 dark:bg-black/30 backdrop-blur-sm flex justify-center items-center z-50"
    >
      <div
        className="bg-white dark:bg-gray-900 p-6 sm:p-8 rounded-2xl shadow-2xl text-center relative w-11/12 max-w-md"
      >
        {/* Close Button - inside popup */}
        <button
          onClick={handleCloseClick}
          className="bg-red-500 px-2 py-1 text-white rounded-xl absolute top-4 right-4 hover:bg-red-600 transition"
        >
          <IoMdClose size={20} />
        </button>

        <h3 className="text-xl font-semibold mb-2 text-gray-800 dark:text-white">
          🎫 Ticket Submitted!
        </h3>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Your issue has been recorded.
        </p>

        {/* OK Button */}
        <button
          onClick={handleOkClick}
          className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition"
        >
          <MdDone size={20} />
        </button>
      </div>
    </div>
  );
}

export default TicketPopup;
