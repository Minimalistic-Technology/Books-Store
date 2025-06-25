'use client';
import Link from 'next/link';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook, faShippingFast, faUndo, faHeadset } from '@fortawesome/free-solid-svg-icons';

export default function Home() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Header */}
      {/* Add your Header component here if needed */}

      {/* Main Content (Hero Section) */}
      <main className="container mx-auto p-4 flex-grow">
        {/* Welcome Section */}
        <section className="text-center mb-8">
          <h1 className="text-4xl text-black font-bold mb-4">Welcome to Book Center</h1>
          <p className="text-lg text-gray-600 mb-8">A Harsh Book Store platform for book lovers</p>
          <a href="/books" className="text-blue-600 hover:underline">
            Explore Books
          </a>
        </section>

        {/* Shop by Class Section */}
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4 px-29 text-black">Shop by Class</h2>
          <div className="w-full max-w-xs mx-auto">
            <select
              onChange={(e) => {
                if (e.target.value) {
                  window.location.href = e.target.value;
                }
              }}
              className="w-full p-2 border-2 border-orange-400 rounded-lg text-black text-center focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Select a Class</option>
              {['Class I', 'Class II', 'Class III', 'Class IV', 'Class V', 'Class VI', 'Class VII', 'Class VIII', 'Class IX', 'Class X', 'Class XI', 'Class XII'].map((className) => (
                <option
                  key={className}
                  value={`/shop/${className.toLowerCase().replace(' ', '-')}`}
                >
                  {className}
                </option>
              ))}
            </select>
          </div>
        </section>

        {/* Best Sellers Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-4 px-29 text-black">Best Sellers</h2>
          <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/integrated-textbook-balbharti-std-4-part-2-924x1042-1.webp"
                alt="Integrated Textbook Balbharati Std. 4 Part 2"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Integrated Textbook Balbharati Std. 4 Part 2 | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹134.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/integrated-textbook-balbharti-std-4-part-1-english-medium-maharashtra-state-board-924x1042-1.webp"
                alt="Integrated Textbook Balbharati Std. 4 Part 1"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Integrated Textbook Balbharati Std. 4 Part 1 | English Medium | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹142.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/integrated-textbook-balbharti-std-4-part-4-924x1042-1.webp"
                alt="Integrated Textbook Balbharati Std. 4 Part 4"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Integrated Textbook Balbharati Std. 4 Part 4 | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/INTEGRATED-TEXTBOOK-BALBHARATI-Std.-SEVEN-Std.-7-English-Medium-Pilot-Project-Part-1-001.webp"
                alt="Integrated Textbook Balbharati Std. 7 Part 1"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Integrated Textbook Balbharati Std. 7 (English Medium) Part-1 | Maharashtra State Board (Pilot Project)</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹159.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/science-and-technology-part-i-class-10-maharashtra-state-board-maharashtra-state-bureau-924x1042-1.webp"
                alt="Science Textbook for SSC Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Science Textbook for SSC (Class 10, English Medium)</p>
                <p className="text-red-500 line-through">₹440.00</p>
                <p className="text-green-600 font-bold">₹75.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* New Arrivals Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-4 px-29 text-black">New Arrivals</h2>
          <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp"
                alt="English Kumarhharati Textbook for Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">English Kumarhharati Textbook for Class 10 (English Medium)</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹79.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/std-10-marathi-aksharbharti-workbook-ssc-english-medium-new-original-imah5z6ysheytezu.webp"
                alt="Marathi Aksharhharati Workbook for SSC Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Marathi Aksharhharati Workbook for SSC Class 10, English Medium</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹49.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/std-10-marathi-aksharbharti-workbook-ssc-english-medium-new-original-imah5z6ysheytezu.webp"
                alt="Hindi Lokbharati Textbook for SSC Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Hindi Lokbharati Textbook for SSC (Class 10, English Medium)</p>
                <p className="text-red-500 line-through">₹290.00</p>
                <p className="text-green-600 font-bold">₹59.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp"
                alt="Algebra Textbook for SSC Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Algebra Textbook for SSC (Class 10, English Medium)</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹89.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/mathematics-2-geometry-10th-standard-ssc-maharashtra-state-board_6_e2c9bb85175b46e28111cc27e179e2ce.png.webp"
                alt="Geometry Textbook for SSC Class 10"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Geometry Textbook for SSC (Class 10, English Medium)</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹79.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Reference Books & Guides Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-4 px-29 text-black">Reference Books & Guides</h2>
          <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6">
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/navneet-digest-std-4-part-1-maharashtra-state-board-navneet-924x1042-1.webp"
                alt="Navneet Digest Std. IV Part 1"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Navneet Digest Std. IV Part 1 | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/navneet-digest-std-4-part-1-maharashtra-state-board-navneet-924x1042-1.webp"
                alt="Navneet Digest Std. IV Part 2"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Navneet Digest Std. IV Part 2 | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/navneet-digest-std-4-part-1-maharashtra-state-board-navneet-924x1042-1.webp"
                alt="Navneet Digest Std. V Environmental Studies"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Navneet Digest Std. V Environmental Studies | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/navneet-digest-environmental-studies-part-1-geography-and-civics-std-5-maharashtra-state-board-navneet-924x1042-1.webp"
                alt="Navneet Digest Std. V Geography and Civics"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Navneet Digest Std. V Geography and Civics | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
            <div className="border rounded-lg overflow-hidden shadow-md">
              <Image
                src="https://harshbookcenter.com/wp-content/uploads/2025/01/navneet-digest-english-balbharti-std-5-maharashtra-state-board-navneet-924x1042-1.webp"
                alt="Navneet Digest English Balbharti Std. V"
                width={150}
                height={169}
                className="w-full h-auto"
              />
              <div className="p-2 text-center">
                <p className="text-sm text-black">Navneet Digest English Balbharti Std. V | Maharashtra State Board</p>
                <p className="text-red-500 line-through">₹490.00</p>
                <p className="text-green-600 font-bold">₹139.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Services Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-semibold mb-6 px-29 text-black">Our Services</h2>
          <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
              <FontAwesomeIcon icon={faBook} className="text-xl text-orange-500 mb-3" />
              <h3 className="text-xl font-medium text-black mb-1">Wide Book Selection</h3>
              <p className="text-base text-black">Explore a vast collection of books for all classes.</p>
            </div>
            <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
              <FontAwesomeIcon icon={faShippingFast} className="text-xl text-orange-500 mb-3" />
              <h3 className="text-xl font-medium text-black mb-1">Fast Shipping</h3>
              <p className="text-base text-black">Get your books delivered quickly to your doorstep.</p>
            </div>
            <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
              <FontAwesomeIcon icon={faUndo} className="text-xl text-orange-500 mb-3" />
              <h3 className="text-xl font-medium text-black mb-1">Easy Returns</h3>
              <p className="text-base text-black">Hassle-free return policy for your convenience.</p>
            </div>
            <div className="text-center p-4 border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200">
              <FontAwesomeIcon icon={faHeadset} className="text-xl text-orange-500 mb-3" />
              <h3 className="text-xl font-medium text-black mb-1">24/7 Support</h3>
              <p className="text-base text-black">Contact us anytime for assistance.</p>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      {/* Add your Footer component here if needed */}
    </div>
  );
}