import React from "react";
import {
  FaFacebookF,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
  FaWikipediaW,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto grid md:grid-cols-5 gap-8 text-sm">
        {/* Search/Company */}
        <div className="md:col-span-1">
          <h4 className="font-semibold text-white mb-4">
            Search for Internet In...
          </h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Choose a state
              </a>
            </li>
          </ul>
          <h4 className="font-semibold text-white mt-6 mb-4">Company</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                About
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Mission
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Press
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Top Brands */}
        <div>
          <h4 className="font-semibold text-white mb-4">Top Brands</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                AT&T Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Spectrum Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                T-Mobile Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                CenturyLink Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cox Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Frontier Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Viasat Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Xfinity Internet
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Hughesnet Internet
              </a>
            </li>
          </ul>
        </div>

        {/* Deals */}
        <div>
          <h4 className="font-semibold text-white mb-4">Deals</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                AT&T Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Spectrum Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                T-Mobile Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Centurylink Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Cox Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Frontier Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Viasat Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Xfinity Internet Deals
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Hughesnet Internet Deals
              </a>
            </li>
          </ul>
        </div>

        {/* Resources */}
        <div>
          <h4 className="font-semibold text-white mb-4">Resources</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Research
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Guides
              </a>
            </li>
          </ul>
          <h4 className="font-semibold text-white mt-6 mb-4">Legal</h4>
          <ul className="space-y-2">
            <li>
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Accessibility
              </a>
            </li>
            <li>
              <a href="#" className="hover:text-white">
                Do Not Sell My Info
              </a>
            </li>
          </ul>
        </div>

        {/* Social & Legal */}
        <div>
          <h4 className="font-semibold text-white mb-4">Social</h4>
          <div className="flex gap-5 mt-4 text-xl text-gray-300">
            <a
              href="#"
              aria-label="Facebook"
              className="hover:text-white transition"
            >
              <FaFacebookF />
            </a>
            <a
              href="#"
              aria-label="LinkedIn"
              className="hover:text-white transition"
            >
              <FaLinkedinIn />
            </a>
            <a
              href="#"
              aria-label="Twitter"
              className="hover:text-white transition"
            >
              <FaTwitter />
            </a>
            <a
              href="#"
              aria-label="YouTube"
              className="hover:text-white transition"
            >
              <FaYoutube />
            </a>
            <a
              href="#"
              aria-label="Wikipedia"
              className="hover:text-white transition"
            >
              <FaWikipediaW />
            </a>
          </div>

          <p className="text-xs text-gray-400 mt-6 leading-relaxed">
            © 2014 - 2025 <strong>BroadbandNow</strong> | BroadbandNow is a
            registered trademark of Centerfield BBN LLC.
          </p>
          <p className="text-xs text-gray-500 mt-4">
            Disclaimer: All trademarks remain the property of their respective
            owners and are used only to describe products and services offered.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
