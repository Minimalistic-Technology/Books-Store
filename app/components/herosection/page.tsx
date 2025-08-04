"use client";

import Link from "next/link";
import Image from "next/image";
import Head from "next/head";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faShippingFast, faUndo, faHeadset } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";
import { API_BASE_URL } from '../../../utils/api';

interface Book {
  _id: string;
  bookName: string;
  title: string;
  price: number;
  imageUrl: string;
  subCategory: string;
  viewCount: number;
}

interface SiteSettings {
  _id: string;
  logo: string | null;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  apiKey: string;
  maintenanceMode: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export default function Home() {
  const [searchResults, setSearchResults] = useState<Book[]>([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/settings`);
        if (!response.ok) throw new Error("Failed to fetch settings");
        const data = await response.json();
        setSettings(data);
      } catch (err) {
        console.error("Error fetching settings:", err);
        setError("Failed to load site settings.");
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSearch = (results: Book[], query?: string) => {
    setSearchResults(results);
    setShowSearchResults(true);
    if (query !== undefined) {
      setSearchQuery(query);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Head>
        <title>{settings?.title || "Book Center"}</title>
        <meta name="description" content={settings?.metaDescription || "Welcome to the best online book store!"} />
        <meta name="keywords" content={settings?.metaKeywords || "books, online store, reading"} />
      </Head>

      <main className="container mx-auto p-4 flex-grow">
        <section className="text-center mb-8">
          {loading ? (
            <p className="text-gray-500 text-lg">Loading...</p>
          ) : error ? (
            <p className="text-red-500 text-lg">{error}</p>
          ) : (
            <>
              <h1 className="text-4xl text-black font-bold mb-4">
                {settings?.metaDescription || "Welcome to Book Center"}
              </h1>
              <p className="text-lg text-gray-600 mb-8">A Harsh Book Store platform for book lovers</p>
              <Link href="/books" className="text-blue-600 hover:underline">
                Explore Books
              </Link>
            </>
          )}
        </section>

        {showSearchResults && searchResults.length > 0 ? (
          <section className="mb-20">
            <h2 className="text-2xl font-semibold mb-4 px-29 text-black">Search Results for "{searchQuery}"</h2>
            <div className="px-29 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {searchResults.map((book) => (
                <div key={book._id} className="border rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={book.imageUrl}
                    alt={book.title}
                    width={150}
                    height={169}
                    className="w-full h-auto"
                  />
                  <div className="p-2 text-center">
                    <p className="text-sm text-black">{book.title}</p>
                    <p className="text-green-600 font-bold">₹{book.price}.00</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        ) : (
          <>
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
          </>
        )}
      </main>
    </div>
  );
}