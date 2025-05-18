import React from 'react';

const Footer = () => {
  return (
    <footer className=" bg-gradient-to-br from-pink-200 via-purple-200 to-indigo-200 bg-size-200 animate-gradient-slow flex flex-col items-center justify-start p-6">
      <div className="max-w-5xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between text-center text-sm">
        <p>&copy; {new Date().getFullYear()} LushFonts. All rights reserved.</p>
        <div className="flex gap-4 mt-2 sm:mt-0">
        </div>
      </div>
    </footer>
  );
};

export default Footer;
