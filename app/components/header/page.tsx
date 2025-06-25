'use client';
import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faShoppingCart } from "@fortawesome/free-solid-svg-icons";

export default function Header() {
  return (
    <div>
      <div className="bg-white text-black px-29 flex justify-between items-center">
        <div className="flex items-center">
          <Link href="/">
            <Image
              src="/Images/logo.png"
              alt="Harsh Books Store Logo"
              width={80}
              height={80}
              className="ml-2 rounded-full hover:opacity-80 transition-opacity duration-300"
            />
          </Link>
          <input
            type="text"
            placeholder="Search for The Intelligent Investor"
            className="ml-4 p-2 rounded border border-gray-300 w-64"
          />
        </div>
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <span className="text-orange-500 mr-2">Need help? Call us:</span>
            <span className="text-black">+91 7977250185</span>
          </div>
          <Link href="/sign-in" className=" hover:underline text-black">
            <FontAwesomeIcon icon={faUser} className="text-lg" />
          </Link>
          <Link href="/cart" className="relative text-black hover:underline">
            <FontAwesomeIcon icon={faShoppingCart} className="text-lg" />
            
          </Link>
        </div>
      </div>
      <nav className="bg-yellow-200 p-4">
        <ul className="flex justify-around items-center px-29">
          <li>
            <Link href="/" className="text-gray-800 hover:underline">
              Home
            </Link>
          </li>
          <li>
            <Link href="/school-books" className="text-gray-800 hover:underline">
              School Books
            </Link>
          </li>
          <li>
            <Link href="/college-books" className="text-gray-800 hover:underline">
              College Books
            </Link>
          </li>
          <li>
            <Link href="/ref-books" className="text-gray-800 hover:underline">
              Ref. Books/Guides
            </Link>
          </li>
          <li>
            <Link
              href="/entrance-exam-books"
              className="text-gray-800 hover:underline"
            >
              Entrance Exam Books
            </Link>
          </li>
          <li>
            <Link
              href="/competitive-exam-books"
              className="text-gray-800 hover:underline"
            >
              Competitive Exam Books
            </Link>
          </li>
          <li>
            <Link href="/stationary" className="text-gray-800 hover:underline">
              Stationary
            </Link>
          </li>
          <li>
            <Link href="/non-academics" className="text-gray-800 hover:underline">
              Non Academics
            </Link>
          </li>
          <li>
            <Link
              href="/request-book"
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Request Your Book
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
}