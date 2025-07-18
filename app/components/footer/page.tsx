
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6">
      <div className="container mx-auto px-29 flex flex-col md:flex-row justify-between items-start space-y-6 md:space-y-0">
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
          <h3 className="font-bold mb-2">Categories</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/school-books" className="hover:underline">School Books</Link></li>
            <li><Link href="/maharashtra-state-board" className="hover:underline">Maharashtra State Board</Link></li>
            <li><Link href="/non-academics" className="hover:underline">Non Academics</Link></li>
            <li><Link href="/self-help-books" className="hover:underline">Self Help Books</Link></li>
            <li><Link href="/reference-books" className="hover:underline">Reference Books & Guides</Link></li>
          </ul>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="font-bold mb-2">Quick Link</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/about-us" className="hover:underline">About Us</Link></li>
            <li><Link href="/disclaimer" className="hover:underline">Disclaimer</Link></li>
            <li><Link href="/privacy-policy" className="hover:underline">Privacy Policy</Link></li>
            <li><Link href="/faqs" className="hover:underline">FAQ's</Link></li>
          </ul>
        </div>

        {/* Contact Us */}
        <div>
          <h3 className="font-bold mb-2">Contact Us</h3>
          <ul className="space-y-1 text-sm">
            <li><Link href="/contact-us" className="hover:underline">Contact Us</Link></li>
            <li><Link href="/cancellation-refund" className="hover:underline">Cancellation and Refund Policy</Link></li>
            <li><Link href="/terms-conditions" className="hover:underline">Terms & Condition</Link></li>
            <li><Link href="/shipping-delivery" className="hover:underline">Shipping and Delivery Policy</Link></li>
          </ul>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="container mx-auto px-29 mt-6 border-t border-gray-700 pt-4 flex flex-col md:flex-row justify-between items-center text-sm">
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
