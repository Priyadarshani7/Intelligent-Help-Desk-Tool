import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';

export default function Solution() {
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { ticketId, solution, has_solution } = location.state || {};

  useEffect(() => {
    if (!solution) {
      navigate('/create-ticket');
    }
  }, [solution, navigate]);

  const handleResponse = async (isResolved) => {
    setLoading(true);
    setError('');
    try {
      const response = await axios.put(`http://localhost:8000/api/tickets/${ticketId}/status`, {
        status: isResolved ? 'resolved' : 'pending',
        solution: isResolved ? solution : null
      });

      if (response.data.success) {
        if (isResolved) {
          setShowPopup(true);
          setTimeout(() => {
            navigate('/all-list');
          }, 2000);
        } else {
          navigate('/all-list');
        }
      }
    } catch (error) {
      console.error('Error updating ticket status:', error);
      setError(error.response?.data?.detail || 'Failed to update ticket status. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleBackToHome = () => {
    navigate('/create-ticket');
  };

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 shadow-2xl rounded-xl">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
              {has_solution ? 'Suggested Solution' : 'No Solution Available'}
            </h2>
            
            <div className="mb-8">
              <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg mb-6">
                <p className="text-gray-800 dark:text-gray-200 whitespace-pre-wrap">
                  {solution}
                </p>
              </div>

              {error && (
                <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-200 rounded-lg">
                  {error}
                </div>
              )}

              {has_solution ? (
                <>
                  <p className="text-gray-700 dark:text-gray-300 mb-4 text-center">
                    Did this solution help resolve your issue?
                  </p>

                  <div className="flex justify-center gap-4">
                    <button
                      onClick={() => handleResponse(true)}
                      disabled={loading}
                      className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'Yes, Resolved'}
                    </button>
                    <button
                      onClick={() => handleResponse(false)}
                      disabled={loading}
                      className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-6 rounded-lg transition disabled:opacity-50"
                    >
                      {loading ? 'Updating...' : 'No, Need Help'}
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex justify-center">
                  <button
                    onClick={handleBackToHome}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-6 rounded-lg transition"
                  >
                    Create New Ticket
                  </button>
                </div>
              )}
            </div>
          </div>

          {showPopup && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-xl">
                <p className="text-gray-800 dark:text-gray-200">
                  Great! Your ticket has been marked as resolved.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
