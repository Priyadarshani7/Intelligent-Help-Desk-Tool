import React from 'react';
import { IoClose } from "react-icons/io5";


function TicketPopup({ onClose }) {
  return (
    <div
      className="fixed top-0 left-0 w-full h-full bg-white bg-opacity-40 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white p-6 rounded-2xl shadow-lg text-center"
        onClick={(e) => e.stopPropagation()} // prevent modal from closing when clicking inside
      >
        <h3 className="text-xl font-semibold mb-2">🎫 Ticket Submitted!</h3>
        <p className="mb-4 text-gray-600">Your issue has been recorded.</p>
        <button
          onClick={onClose}
          className="bg-red-700 text-white px-3 py-2 rounded-2xl hover:bg-red-500 "
        >
          <IoClose size={20}/>
        </button>
      </div>
    </div>
  );
}


export default TicketPopup;
