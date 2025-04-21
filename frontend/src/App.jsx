import React from 'react';
import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Home from './pages/Home';
import CreateTicket from './pages/CreateTicket';
import AllList from './pages/AllList';


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
      <Route path="/create-ticket" element={<CreateTicket/>}/>
      <Route path="/all-list" element={<AllList/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
