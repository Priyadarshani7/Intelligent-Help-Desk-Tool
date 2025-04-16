import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-2">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
     
          <div>
            <h2 className="text-base font-semibold mb-1">About Us</h2>
            <p className="text-gray-400 text-sm">
              Smartly classify support tickets and route them to the right department instantly.
            </p>
          </div>

      
          <div>
            <h2 className="text-base font-semibold mb-1">Quick Links</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">FAQs</a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">Contact Us</a>
              </li>
            </ul>
          </div>

      
          <div>
            <h2 className="text-base font-semibold mb-1">Resources</h2>
            <ul className="space-y-1 text-sm">
              <li>
                <a href="#" className="text-gray-400 hover:text-white transition">More Details</a>
              </li>
            </ul>
          </div>
        </div>

 
        <div className="mt-4 text-center text-xs text-gray-500">
          © 2024 Intelligent Help Desk Tool. All rights reserved.
          <div className="mt-1">
            <a href="/privacy" className="mx-2 hover:text-white">Privacy Policy</a>|
            <a href="/terms" className="mx-2 hover:text-white">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
