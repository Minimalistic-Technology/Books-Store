"use client";
import Link from "next/link";
import Image from "next/image";

interface Book {
  _id: string;
  bookName: string;
  title: string;
  price: number;
  discountedPrice: number;
  imageUrl: string;
  subCategory: string;
  viewCount: number;
}

interface BookCardProps {
  book: Book;
}

const BookCard: React.FC<BookCardProps> = ({ book }) => {
  const hasDiscount = book.discountedPrice < book.price;

  return (
    <div className="border rounded-lg overflow-hidden shadow-md w-[200px] h-[300px] flex flex-col justify-between">
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
            <p className="text-red-500 line-through">₹{book.price.toFixed(2)}</p>
            <p className="text-green-600 font-bold">₹{book.discountedPrice.toFixed(2)}</p>
          </>
        ) : (
          <p className="text-green-600 font-bold">₹{book.price.toFixed(2)}</p>
        )}
      </div>
    </div>
  );
};

export default BookCard;