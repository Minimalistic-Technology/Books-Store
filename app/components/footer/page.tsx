
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container md:mx-auto px-20  flex flex-col gap-5 flex-wrap md:flex-row justify-between items-start space-y-6 md:space-y-0 ">
        {/* Logo and Contact Info */}
        <div className="flex flex-col items-start">
          <div className="flex items-center mb-2 rounded-xl">
            <Link href="/">
            <Image
              src="/Images/logo.png"
              alt="Harsh Books Store Logo"
              width={80}
              height={80}
              className="ml-2 rounded-full hover:scale-105 transition-transform duration-300 ease-in-out"
            />
          </Link>
          </div>
          <p className="text-sm mb-2">Call us 24/7: +91 7977250185</p>
          <p className="text-sm mb-2">Ramnath Mishra Compound, Dahisar E, Mumbai</p>
          <p className="text-sm mb-2">contact@Harshbookcenter.com</p>
          <div className="flex space-x-2 mt-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <span className="text-white hover:text-gray-300">f</span>
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <span className="text-white hover:text-gray-300">X</span>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <span className="text-white hover:text-gray-300">o</span>
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
              <span className="text-white hover:text-gray-300">v</span>
            </a>
            <a href="https://email.com" target="_blank" rel="noopener noreferrer">
              <span className="text-white hover:text-gray-300">e</span>
            </a>
          </div>
        </div>

        {/* Categories */}
        <div>
          <h3 className="font-bold mb-2 underline">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li><p  className="hover:underline">School Books</p></li>
            <li><p  className="hover:underline">Maharashtra State Board</p></li>
            <li><p  className="hover:underline">Non Academics</p></li>
            <li><p  className="hover:underline">Self Help Books</p></li>
            <li><p  className="hover:underline">Reference Books & Guides</p></li>
          </ul>
        </div>

        {/* Quick ps */}
        <div>
          <h3 className="font-bold mb-2 underline">Quick p</h3>
          <ul className="space-y-1 text-sm">
            <li><p  className="hover:underline">About Us</p></li>
            <li><p  className="hover:underline">Disclaimer</p></li>
            <li><p  className="hover:underline">Privacy Policy</p></li>
            <li><p  className="hover:underline">FAQ&apos;s</p></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-bold mb-2 underline">Contact Us</h3>
          <ul className="space-y-1 text-sm">
            <li><p className="hover:underline">Contact Us</p></li>
            <li><p className="hover:underline">Cancellation and Refund Policy</p></li>
            <li><p className="hover:underline">Terms & Condition</p></li>
            <li><p className="hover:underline">Shipping and Delivery Policy</p></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-20 md:px-29 mt-6 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
        <p>Copyright © 2025 Harsh Book Center</p>
        <div className="flex space-x-2 mt-2 md:mt-0">
          <span>We Using Safe Payment For</span>
          <div className="flex space-x-1">
            <span className="text-white">VISA</span>
            <span className="text-white">UPI</span>
            <span className="text-white">Skrill</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
