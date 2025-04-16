import React from "react";

function Footer() {
  return (
    <footer className="p-6 bg-gray-900 text-white text-center mt-auto">
      <div className="container mx-auto">
        <p className="text-sm">© 2024 E-Commerce Store. All rights reserved.</p>
        <div className="mt-4">
          <a
            href="/privacy"
            className="text-sm text-gray-400 hover:text-white mx-2"
          >
            Privacy Policy
          </a>
          <a
            href="/terms"
            className="text-sm text-gray-400 hover:text-white mx-2"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}

export default Footer;