"use client";
import { Book } from "@/app/admin/order-product-management/types";
// import Link from "next/link";
import Image from "next/image";

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const hasDiscount = book.discountedPrice <  book.price;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md w-full h-full flex flex-col justify-between">
      <div className="w-full h-[200px] overflow-hidden">
        <Image
          src={book.imageUrl}
          alt={book.title}
          width={200}
          height={200}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-2 text-center flex-grow">
        <p className="text-sm text-black line-clamp-2">{book.title}</p>
        {hasDiscount ? (
          <>
            <p className="text-red-500 line-through">
              ₹{book.price.toFixed(2)}
            </p>
            <p className="text-green-600 font-bold">
              ₹{book.discountedPrice.toFixed(2)}
            </p>
          </>
        ) : (
          <p className="text-green-600 font-bold">₹{book.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;
