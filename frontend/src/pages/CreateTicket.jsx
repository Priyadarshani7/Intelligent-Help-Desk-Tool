import React, { useState } from 'react';
import MainLayout from '../layout/MainLayout';
import TicketPopup from '../components/TicketPopup'; 

function CreateTicket() {
  const [showPopup, setShowPopup] = useState(false);
  const [ticketInfo, setTicketInfo] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Set the ticket info and display the popup
    setTicketInfo('Your issue has been recorded.');
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 flex justify-center items-start bg-gray-50">
        <div className="w-full max-w-2xl bg-white p-8 shadow-2xl rounded-xl">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Create a New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                placeholder="your.email@example.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Subject</label>
              <input
                type="text"
                name="subject"
                placeholder="Brief summary of your issue"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Description</label>
              <textarea
                name="description"
                rows="4"
                placeholder="Describe your issue here..."
                className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-gray-700">Priority</label>
              <select
                name="priority"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
              >
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            </div>

            <div className="text-center">
              <button
                type="submit"
                className="px-6 py-3 bg-[#00A8CC] text-white font-semibold rounded-lg hover:bg-[#008C99] transition"
              >
                Submit Ticket
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Show the popup if showPopup is true */}
      {showPopup && <TicketPopup onClose={handleClosePopup} />}
    </MainLayout>
  );
}

export default CreateTicket;
