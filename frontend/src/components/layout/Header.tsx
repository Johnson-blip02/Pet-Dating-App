import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header style={{ backgroundColor: "#F79B72" }} className="shadow">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <div className="text-xl font-bold text-gray-800">
          <Link to="/">PetMatch</Link>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex space-x-6">
          <Link to="/Explore" className="text-gray-600 hover:text-gray-900">
            Explore
          </Link>
          <Link to="/Help" className="text-gray-600 hover:text-gray-900">
            Help
          </Link>
        </nav>

        {/* Auth Buttons */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/login"
            className="px-4 py-2 border border-gray-300 rounded hover:bg-gray-100 text-sm"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm"
          >
            Sign Up
          </Link>
        </div>

        {/* Mobile Menu Button (Hamburger) */}
        <div className="md:hidden">
          <button className="text-gray-600 hover:text-gray-900 focus:outline-none">
            {/* Hamburger icon */}
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
