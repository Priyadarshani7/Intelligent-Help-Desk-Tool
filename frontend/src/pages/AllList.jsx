import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';  // Import Link from react-router-dom
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';
import TicketStatus from '../components/TicketStatus';  // Add this import

const AllList = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1); // State to track the current page
  const ticketsPerPage = 7; // Number of tickets per page updated to 7

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
    
    // Use Intl.DateTimeFormat to convert the date to IST (Asia/Kolkata timezone)
    const options = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: 'Asia/Kolkata',  // Set time zone to IST
    };
  
    // Format the date to IST and return it
    return new Intl.DateTimeFormat('en-US', options).format(date);
  };
  
  const handleNextPage = (e) => {
    e.preventDefault(); // Prevent default behavior
    if (currentPage * ticketsPerPage < tickets.length) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = (e) => {
    e.preventDefault(); // Prevent default behavior
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const startIndex = (currentPage - 1) * ticketsPerPage;
  const currentTickets = tickets.slice(startIndex, startIndex + ticketsPerPage);

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900 transition duration-300">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>

        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-semibold mb-6 text-gray-900 dark:text-white text-center">
            All Tickets
          </h2>

          {loading ? (
            <p className="text-center text-gray-700 dark:text-gray-300 text-lg font-medium">Loading...</p>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full text-sm text-left border border-gray-300 dark:border-gray-700">
                  <thead className="bg-blue-600 text-white dark:bg-blue-800">
                    <tr>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Created Date</th>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Ticket ID</th>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Subject</th>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Description</th>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Priority</th>
                      <th className="p-3 border-r border-gray-300 dark:border-gray-700">Category</th>
                      <th className="p-3">Ticket Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentTickets.map((ticket) => (
                      <tr key={ticket.ticket_id} className="border-b border-gray-300 dark:border-gray-700">
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                          {formatDate(ticket.created_at)}
                        </td>
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-blue-600 dark:text-blue-400">
                          <Link
                            to={`/ticket/${ticket.ticket_id}`}
                            className="hover:underline"
                          >
                            {ticket.ticket_id}
                          </Link>
                        </td>
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                          {ticket.subject || 'N/A'}
                        </td>
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                          {ticket.description}
                        </td>
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                          {ticket.priority || 'N/A'}
                        </td>
                        <td className="p-3 border-r border-gray-300 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                          {ticket.category}
                        </td>
                        <td className="p-3 text-gray-900 dark:text-gray-200">
                          <TicketStatus status={ticket.status} />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center mt-4">
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className={`px-4 py-2 bg-blue-600 text-white rounded ${
                    currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                >
                  Previous
                </button>
                <span className="text-gray-700 dark:text-gray-300">
                  Page {currentPage} of {Math.ceil(tickets.length / ticketsPerPage)}
                </span>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage * ticketsPerPage >= tickets.length}
                  className={`px-4 py-2 bg-blue-600 text-white rounded ${
                    currentPage * ticketsPerPage >= tickets.length
                      ? 'opacity-50 cursor-not-allowed'
                      : 'hover:bg-blue-700'
                  }`}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default AllList;
