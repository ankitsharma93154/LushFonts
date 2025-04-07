import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gradient-to-r from-indigo-100 to-purple-100   text-[#6c3483] py-6 border-t border-purple-200 ">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-center text-sm">
        <p>&copy; {new Date().getFullYear()} LushFonts. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
