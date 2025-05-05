import React, { useEffect, useState } from 'react';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';
import { useNavigate } from 'react-router-dom';
import Loader from '../components/Loader';

function CreateTicket() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    email: '',
    subject: '',
    description: '',
    priority: '',
  });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

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
    setLoading(true);
    setError('');
    
    try {
      const response = await axios.post('http://localhost:8000/api/tickets', formData);
      console.log('Ticket creation response:', response.data);
      
      navigate('/solution', { 
        state: { 
          ticketId: response.data.ticket?.ticket_id,
          solution: response.data.solution,
          has_solution: response.data.has_solution,
          ...formData // Pass along the form data
        } 
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      setError(
        error.response?.data?.detail || 
        'Failed to submit ticket. Please check your connection and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      {loading && <Loader message="Submitting ticket..." />}
      <div className="min-h-screen py-12 px-4 flex justify-center items-start bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>
        <div className="w-full max-w-xl">
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 shadow-2xl rounded-xl px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Create Support Ticket</h2>
            
            {error && (
              <div className="mb-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="email"
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="subject">
                Subject
              </label>
              <input
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="subject"
                type="text"
                name="subject"
                placeholder="Enter ticket subject"
                value={formData.subject}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="description">
                Description
              </label>
              <textarea
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                id="description"
                name="description"
                rows="4"
                placeholder="Describe your issue"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-6">
  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2" htmlFor="priority">
    Priority
  </label>
  <select
  className="shadow appearance-none border rounded w-full py-2 px-3 text-black leading-tight focus:outline-none focus:shadow-outline dark:bg-gray-700 dark:border-gray-600 dark:text-white"
  id="priority"
  name="priority"
  value={formData.priority}
  onChange={handleChange}
  required
>
  <option value="" disabled>
    Select priority
  </option>
  <option value="Low">Low</option>
  <option value="Medium">Medium</option>
  <option value="High">High</option>
</select>


</div>


            <div className="flex items-center justify-between">
              <button
                className="bg-[#00A8CC] hover:bg-[#008C99] text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full transition disabled:opacity-50"
                type="submit"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Ticket'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </MainLayout>
  );
}

export default CreateTicket;
