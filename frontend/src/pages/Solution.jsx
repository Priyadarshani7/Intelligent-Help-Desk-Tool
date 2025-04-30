import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';

const TicketPopup = ({ onClose }) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-2xl shadow-lg w-96 dark:bg-gray-800 dark:text-white">
      <h2 className="text-xl font-bold mb-4 text-center">Thank You!</h2>
      <p className="text-center mb-6">Your feedback has been recorded successfully.</p>
      <div className="text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 bg-[#00A8CC] text-white rounded-lg hover:bg-[#008C99] transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
);

export default function IssueResolvedPage() {
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const ticketId = location.state?.ticketId;

  const handleYesClick = async () => {
    console.log('Attempting to update ticket:', ticketId);
    if (ticketId) {
      try {
        await axios.put(`http://localhost:8000/api/tickets/${ticketId}/status`, {
          status: 'resolved'
        });
        setShowPopup(true);
      } catch (error) {
        console.error('Error updating ticket status:', error);
        alert('Failed to update ticket status');
      }
    } else {
      console.error('No ticket ID found');
      alert('No ticket ID found');
    }
  };

  const handleNoClick = () => {
    navigate('/create-ticket');
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    navigate('/all-list');
  };

  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 dark:text-white text-center px-4">
      <h1 className="text-3xl font-semibold mb-8">Has your issue been resolved?</h1>
      <div className="flex gap-4">
        <button
          onClick={handleYesClick}
          className="bg-green-500 hover:bg-green-600 text-white py-3 px-8 rounded-xl transition text-lg"
        >
          Yes
        </button>
        <button
          onClick={handleNoClick}
          className="bg-red-500 hover:bg-red-600 text-white py-3 px-8 rounded-xl transition text-lg"
        >
          No
        </button>
      </div>

      {showPopup && <TicketPopup onClose={handleClosePopup} />}
    </div>
  );
}
