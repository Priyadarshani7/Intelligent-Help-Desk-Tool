import React from "react";
import Header from "../components/Header"; 
import Footer from "../components/Footer";

const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen">
 
    <header className="sticky top-0 z-20 bg-[#00A8CC]">
      <Header />
    </header>

   
    <main className="flex-grow">
      {children}
    </main>

 
    <footer className="mt-auto bg-gray-900 text-white ">
      <Footer />
    </footer>
  </div>
);

export default MainLayout;
