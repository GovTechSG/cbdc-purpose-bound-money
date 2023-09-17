import React from "react";

export default function Footer() {
  return (
    <footer>
      <div className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="border-t border-t-gray-100 pt-16 min-h-[5] drop-shadow-lg" />
          <div className="text-center text-gray-400 text-sm leading-5">
            <div>Built with ❤️ by GovTech for Project Orchid.</div>
            <div>&copy; 2023 GovTech. All rights reserved.</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
