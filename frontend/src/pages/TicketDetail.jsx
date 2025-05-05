import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import MainLayout from '../layout/MainLayout';
import Toggle from '../components/Toggle';
import TicketStatus from '../components/TicketStatus';
import { IoCloseSharp } from "react-icons/io5";

const TicketDetail = () => {
  window.scrollTo(0,0); 
  const { ticketId } = useParams();
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTicketDetails = async () => {
      try {
        const response = await axios.get(`http://localhost:8000/api/tickets/${ticketId}`);
        setTicket(response.data);
      } catch (error) {
        console.error('Error fetching ticket details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTicketDetails();
  }, [ticketId]);

  return (
    <MainLayout>
      <div className="min-h-screen py-12 px-4 bg-gray-50 dark:bg-gray-900">
        <div className="absolute top-6 right-6">
          <Toggle />
        </div>

        <div className="max-w-7xl mx-auto relative">
          <button 
            onClick={() => navigate('/all-list')}
            className="absolute -top-2 right-0 p-2 text-gray-600 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400 transition-colors"
          >
            <IoCloseSharp size={24} />
          </button>

          {loading ? (
            <p className="text-center text-gray-600 dark:text-gray-300">Loading...</p>
          ) : ticket ? (
            <div className="flex gap-6">
              {/* Left side - Ticket Details */}
              <div className="w-1/2 bg-white dark:bg-gray-800 p-8 shadow-2xl rounded-xl text-gray-800 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Ticket Details</h2>
                
                <div className="space-y-4">
                  <p><strong className="text-gray-700 dark:text-gray-300">Ticket ID:</strong> {ticket.ticket_id}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Subject:</strong> {ticket.subject}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Description:</strong> {ticket.description}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Priority:</strong> {ticket.priority}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Category:</strong> {ticket.category}</p>
                  <p><strong className="text-gray-700 dark:text-gray-300">Status:</strong> <TicketStatus status={ticket.status} /></p>
                  
                  {ticket.status === 'pending' && ticket.assigned_to && (
                    <p><strong className="text-gray-700 dark:text-gray-300">Assigned To:</strong> {ticket.assigned_to}</p>
                  )}
                  
                  <p><strong className="text-gray-700 dark:text-gray-300">Created At:</strong> {new Date(ticket.created_at).toLocaleString()}</p>
                </div>
              </div>

              {/* Right side - Solution */}
              <div className="w-1/2 bg-white dark:bg-gray-800 p-8 shadow-2xl rounded-xl text-gray-800 dark:text-gray-200">
                <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Solution</h2>
                <div className="bg-gray-50 dark:bg-gray-700 p-6 rounded-lg min-h-[300px]">
                  {ticket.status === 'resolved' && ticket.solution ? (
                    <p className="whitespace-pre-wrap text-gray-700 dark:text-gray-300">{ticket.solution}</p>
                  ) : (
                    <p className="text-center text-gray-500 dark:text-gray-400">
                      {ticket.status === 'resolved' 
                        ? 'No solution provided yet.'
                        : 'Solution will be available once the ticket is resolved.'}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-600 dark:text-gray-300">Ticket not found.</p>
          )}
        </div>
      </div>
    </MainLayout>
  );
}

export default TicketDetail;
