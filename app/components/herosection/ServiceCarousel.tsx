
"use client";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBook, faShippingFast, faUndo, faHeadset, faChevronLeft, faChevronRight, IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";

interface Service {
  icon: IconDefinition;
  title: string;
  description: string;
}

const servicesData: Service[] = [
  { icon: faBook, title: "Wide Book Selection", description: "Explore a vast collection of books for all classes." },
  { icon: faShippingFast, title: "Fast Shipping", description: "Get your books delivered quickly to your doorstep." },
  { icon: faUndo, title: "Easy Returns", description: "Hassle-free return policy for your convenience." },
  { icon: faHeadset, title: "24/7 Support", description: "Contact us anytime for assistance." },
];

const ServiceCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 1;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + itemsPerPage) % servicesData.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - itemsPerPage + servicesData.length) % servicesData.length);
  };

  return (
    <section className="mb-20">
      <h2 className="text-2xl font-semibold mb-4 px-6 text-black">Our Services</h2>
      <div className="relative px-6">
        <div className="flex overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerPage)}%)`,
              width: `${servicesData.length * (100 / itemsPerPage)}%`,
            }}
          >
            {servicesData.map((service, index) => (
              <div key={index} className="w-full p-1">
                <div className="border rounded-lg shadow-md bg-white hover:bg-gray-50 transition duration-200 w-[200px] h-[300px] flex flex-col justify-between text-center p-4">
                  <FontAwesomeIcon icon={service.icon} className="text-xl text-orange-500 mb-3" />
                  <h3 className="text-xl font-medium text-black mb-1">{service.title}</h3>
                  <p className="text-base text-black flex-grow">{service.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <button
          onClick={handlePrev}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-gray-800 text-white p-2 rounded-full hover:bg-gray-600"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </section>
  );
};

export default ServiceCarousel;