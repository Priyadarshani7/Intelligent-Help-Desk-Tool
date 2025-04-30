import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import AllList from './pages/AllList';
import TicketDetail from './pages/TicketDetail';
import Solution from './pages/Solution';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-ticket" element={<CreateTicket/>}/>
        <Route path="/all-list" element={<AllList/>}/>
        <Route path="/ticket/:ticketId" element={<TicketDetail/>}/>
        <Route path="/solution" element={<Solution />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
