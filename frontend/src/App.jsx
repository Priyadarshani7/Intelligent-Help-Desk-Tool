import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/create-ticket" element={<CreateTicket/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
