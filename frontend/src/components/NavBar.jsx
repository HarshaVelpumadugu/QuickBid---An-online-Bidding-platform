import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import { useState } from "react";

const NavBar = () => {
  const { isLoggedIn } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-gray-900 bg-opacity-80 backdrop-blur-md p-4 shadow-lg">
      <div className="w-full flex items-center justify-between">
        {/* Logo */}
        <Link className="text-xl font-bold text-yellow-500" to="/">
          QuickBid
        </Link>

        {/* Hamburger button for mobile */}
        <button
          className="lg:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
          >
            <path
              d="M28 10.3333H4C3.45333 10.3333 3 9.88 3 9.33334C3 8.78667 3.45333 8.33334 4 8.33334H28C28.5467 8.33334 29 8.78667 29 9.33334C29 9.88 28.5467 10.3333 28 10.3333Z"
              fill="white"
            />
            <path
              d="M28 17H4C3.45333 17 3 16.5467 3 16C3 15.4533 3.45333 15 4 15H28C28.5467 15 29 15.4533 29 16C29 16.5467 28.5467 17 28 17Z"
              fill="white"
            />
            <path
              d="M28 23.6667H4C3.45333 23.6667 3 23.2133 3 22.6667C3 22.12 3.45333 21.6667 4 21.6667H28C28.5467 21.6667 29 22.12 29 22.6667C29 23.2133 28.5467 23.6667 28 23.6667Z"
              fill="white"
            />
          </svg>
        </button>

        {/* Desktop Nav */}
        <div className="hidden lg:flex lg:items-center lg:space-x-6">
          <Link className="text-white hover:text-gray-300 text-lg" to="/">
            Home
          </Link>
          <Link
            className="text-white hover:text-gray-300 text-lg"
            to="/auctions"
          >
            Auctions
          </Link>
          {!isLoggedIn && (
            <>
              <Link
                className="text-white hover:text-gray-300 text-lg"
                to="/login"
              >
                Login
              </Link>
              <Link
                className="text-white hover:text-gray-300 text-lg"
                to="/signup"
              >
                Signup
              </Link>
            </>
          )}
          {isLoggedIn && (
            <>
              <Link
                className="text-white hover:text-gray-300 text-lg"
                to="/profile"
              >
                Profile
              </Link>
              <Link
                className="text-white hover:text-gray-300 text-lg"
                to="/logout"
              >
                Logout
              </Link>
            </>
          )}
        </div>
      </div>

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className="lg:hidden mt-4 bg-gray-800 rounded-lg shadow-lg p-4">
          <ul className="list-none flex flex-col space-y-4">
            <li>
              <Link className="text-white hover:text-gray-300 text-lg" to="/">
                Home
              </Link>
            </li>
            <li>
              <Link
                className="text-white hover:text-gray-300 text-lg"
                to="/auctions"
              >
                Auctions
              </Link>
            </li>
            {!isLoggedIn && (
              <>
                <li>
                  <Link
                    className="text-white hover:text-gray-300 text-lg"
                    to="/login"
                  >
                    Login
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:text-gray-300 text-lg"
                    to="/signup"
                  >
                    Signup
                  </Link>
                </li>
              </>
            )}
            {isLoggedIn && (
              <>
                <li>
                  <Link
                    className="text-white hover:text-gray-300 text-lg"
                    to="/profile"
                  >
                    Profile
                  </Link>
                </li>
                <li>
                  <Link
                    className="text-white hover:text-gray-300 text-lg"
                    to="/logout"
                  >
                    Logout
                  </Link>
                </li>
              </>
            )}
          </ul>
        </div>
      )}
    </nav>
  );
};

export default NavBar;
