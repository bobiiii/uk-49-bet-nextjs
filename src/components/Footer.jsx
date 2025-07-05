import Link from "next/link";
import React from "react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8">
          <div className="col-span-1 md:col-span-1">
            <h3 className="text-lg font-semibold mb-4">UK49s Results</h3>
            <p className="text-gray-400 text-sm">
              The most comprehensive UK49s lottery results and predictions
              platform. Stay updated with the latest draws and improve your
              chances.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-4 md:contents">
            <div>
              <h4 className="text-md font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/results"
                    className="text-gray-400 hover:text-white"
                  >
                    Latest Results
                  </Link>
                </li>
                <li>
                  <Link
                    href="/history"
                    className="text-gray-400 hover:text-white"
                  >
                    History
                  </Link>
                </li>
                <li>
                  <Link
                    href="/predictions"
                    className="text-gray-400 hover:text-white"
                  >
                    Predictions
                  </Link>
                </li>
                <li>
                  <Link
                    href="/statistics"
                    className="text-gray-400 hover:text-white"
                  >
                    Statistics
                  </Link>
                </li>
                <li>
                  <Link
                    href="/guide"
                    className="text-gray-400 hover:text-white"
                  >
                    How to Play
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="text-md font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/tools"
                    className="text-gray-400 hover:text-white"
                  >
                    Tools
                  </Link>
                </li>
                <li>
                  <Link href="/news" className="text-gray-400 hover:text-white">
                    News
                  </Link>
                </li>
                <li>
                  <Link
                    href="/about"
                    className="text-gray-400 hover:text-white"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/faq" className="text-gray-400 hover:text-white">
                    FAQ
                  </Link>
                </li>
                <li>
                  <Link
                    href="/contact"
                    className="text-gray-400 hover:text-white"
                  >
                    Contact
                  </Link>
                </li>
                <li>
                  <Link
                    href="/privacy"
                    className="text-gray-400 hover:text-white"
                  >
                    Privacy Policy
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1">
            <h4 className="text-md font-semibold mb-4">Disclaimer</h4>
            <p className="text-gray-400 text-xs">
              This website is for informational purposes only. Gambling can be
              addictive. Please play responsibly. You must be 18+ to participate
              in lottery games.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-800 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center text-gray-400 text-sm">
          <p>
            &copy; 2024 UK49s Results. All rights reserved. |{" "}
            <Link href="/privacy" className="hover:text-white">
              Privacy Policy
            </Link>{" "}
            | Responsible Gaming
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
