import React, { useState, useEffect } from 'react';
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';

const AllList = () => {
  const [tickets, setTickets] = useState([]);

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
    setTickets([
      { id: 1, subject: 'Login issue', description: 'Issue logging in', priority: 'High', category: 'IT' },
      { id: 2, subject: 'Payment issue', description: 'Late invoice', priority: 'Low', category: 'Finance' },
    ]);
  }, []);

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

          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left border border-black dark:border-white">
              <thead className="bg-[#00A8CC] text-white">
                <tr>
                  <th className="p-3 border border-black dark:border-white">ID</th>
                  <th className="p-3 border border-black dark:border-white">Subject</th>
                  <th className="p-3 border border-black dark:border-white">Description</th>
                  <th className="p-3 border border-black dark:border-white">Priority</th>
                  <th className="p-3 border border-black dark:border-white">Category</th>
                </tr>
              </thead>
              <tbody>
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="border-b border-black dark:border-white">
                    <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                      {ticket.id}
                    </td>
                    <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                      {ticket.subject}
                    </td>
                    <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                      {ticket.description}
                    </td>
                    <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                      {ticket.priority}
                    </td>
                    <td className="p-3 border border-black dark:border-white text-gray-800 dark:text-white">
                      {ticket.category}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default AllList;
