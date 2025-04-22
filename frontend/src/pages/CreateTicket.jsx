import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import TicketPopup from '../components/TicketPopup';
import Toggle from '../components/Toggle';

function CreateTicket() {
  const [showPopup, setShowPopup] = useState(false);
  const [ticketInfo, setTicketInfo] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    description: '',
    priority: 'Low',
  });

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        localStorage.theme === 'dark' ||
        document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', isDarkMode);
    };
    checkTheme();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/api/tickets', formData);
      setTicketInfo('Your issue has been recorded.');
      setShowPopup(true);
      setFormData({
        email: '',
        subject: '',
        description: '',
        priority: 'Low',
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      setTicketInfo('There was an error submitting the ticket.');
      setShowPopup(true);
    }
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 flex justify-center items-start bg-gray-50 dark:bg-black">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>
        <div className="w-full max-w-2xl bg-white p-8 shadow-2xl rounded-xl text-gray-800">
          <h2 className="text-2xl font-bold mb-6 text-center">Create a New Ticket</h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Subject</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="Brief summary of your issue"
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Description</label>
              <textarea
                name="description"
                rows="4"
                value={formData.description}
                onChange={handleChange}
                placeholder="Describe your issue here..."
                className="w-full border border-gray-300 px-4 py-2 rounded-lg resize-y focus:outline-none focus:ring-2 focus:ring-blue-200"
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Priority</label>
              <select
                name="priority"
                value={formData.priority}
                onChange={handleChange}
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

      {showPopup && <TicketPopup message={ticketInfo} onClose={handleClosePopup} />}
    </MainLayout>
  );
}

export default CreateTicket;
