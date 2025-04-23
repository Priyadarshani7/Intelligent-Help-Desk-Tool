import React, { useState, useEffect } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';

const AllList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkTheme = () => {
      const isDarkMode =
        localStorage.theme === 'dark' ||
        document.documentElement.classList.contains('dark');
      document.documentElement.classList.toggle('dark', isDarkMode);
    };

    checkTheme();
  }, []);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/tickets');
        setTickets(response.data);
      } catch (error) {
        console.error('Error fetching tickets:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-black transition duration-300">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-white text-center">
            All Tickets
          </h2>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-left border border-black dark:border-white">
                <thead className="bg-[#00A8CC] text-white">
                  <tr>
                    <th className="p-3 border border-black dark:border-white">Created Date</th>
                    <th className="p-3 border border-black dark:border-white">Ticket ID</th>
                    <th className="p-3 border border-black dark:border-white">Subject</th>
                    <th className="p-3 border border-black dark:border-white">Description</th>
                    <th className="p-3 border border-black dark:border-white">Priority</th>
                    <th className="p-3 border border-black dark:border-white">Category</th>
                  </tr>
                </thead>
                <tbody>
                  {tickets.map((ticket) => (
                    <tr key={ticket.ticket_id} className="border-b border-black dark:border-white">
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {formatDate(ticket.created_at)}
                      </td>
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {ticket.ticket_id}
                      </td>
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {ticket.subject || 'N/A'}
                      </td>
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {ticket.description}
                      </td>
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {ticket.priority || 'N/A'}
                      </td>
                      <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                        {ticket.category}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllList;
