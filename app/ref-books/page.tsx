'use client';
import Header from "../components/header/page";
import Footer from "../components/footer/page";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faThLarge, faList } from "@fortawesome/free-solid-svg-icons";
import { useState, useEffect } from "react";

export default function SchoolBooks() {
    const categories = [
        "School TextBooks",
        "Class II",
        "Class III",
        "Class IV",
        "Class V",
        "Class VI",
        "Class VII",
        "Class VIII",
        "Class IX",
        "Class X",
        "Class XI",
        "Practical NoteBooks",
        "Reference Books&Notes",
        "College Books",
        "B.Com - Bachelor of Commerce",
        "Non Academic Books",
        "Maharashtra State Board",
        "SSC Board",
        "Navneet Digest",
        "Mathematics",
        "Investing",
        "Business",
        "Commerce",
        "Personal Finance",
        "Psychology",
        "Philosophy",
        "Fiction",
        "Romance",
        "Self-Help",
        "Uncategorized",
    ];

    interface Book {
        src: string;
        alt?: string;
        price: string;
        description: string;
        class: string;
    }

   const books = [
    // School TextBooks
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp", class: "School TextBooks", price: "₹89.00", description: "Mathematics Part 1 Textbook for Class 10, English Medium, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp", class: "School TextBooks", price: "₹79.00", description: "English Kumarhharati Textbook for Class 10, Latest Edition, Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-9-Entire-Set-Books/dp/B08L9K9Q8K", class: "School TextBooks", price: "₹1,870.00", description: "Std 9 Entire Set Books, English Medium, IX Maharashtra Board, Set of 8" },

    // Class II
    { src: "https://www.amazon.in/Std-2-Marathi-Grammer-Skills/dp/B08L9K9Q9L", class: "Class II", price: "₹150.00", description: "Std 2 Marathi Grammar & Writing Skill Book, English Medium, Maharashtra State Board" },
    { src: "https://www.selfstudys.com/maharashtra-board-class-2-books", class: "Class II", price: "₹120.00", description: "Maharashtra State Board Class 2 Textbooks, Marathi Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-2", class: "Class II", price: "₹130.00", description: "Class 2 Textbooks, General Subjects, SCERT Goa" },

    // Class III
    { src: "https://www.selfstudys.com/maharashtra-board-class-3-books", class: "Class III", price: "₹140.00", description: "Maharashtra State Board Class 3 Textbooks, English Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-3", class: "Class III", price: "₹135.00", description: "Class 3 Textbooks, Multi-Subject, SCERT Goa" },
    { src: "https://www.amazon.in/Std-3-Maths-Workbook/dp/B08L9K9Q9M", class: "Class III", price: "₹145.00", description: "Std 3 Mathematics Workbook, Maharashtra State Board" },

    // Class IV
    { src: "https://www.selfstudys.com/maharashtra-board-class-4-books", class: "Class IV", price: "₹150.00", description: "Maharashtra State Board Class 4 Textbooks, Marathi Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-4", class: "Class IV", price: "₹140.00", description: "Class 4 Textbooks, General Subjects, SCERT Goa" },
    { src: "https://www.amazon.in/Std-4-Science-Notes/dp/B08L9K9Q9N", class: "Class IV", price: "₹160.00", description: "Std 4 Science Notes, Maharashtra State Board" },

    // Class V
    { src: "https://www.selfstudys.com/maharashtra-board-class-5-books", class: "Class V", price: "₹155.00", description: "Maharashtra State Board Class 5 Textbooks, English Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-5", class: "Class V", price: "₹145.00", description: "Class 5 Textbooks, Multi-Subject, SCERT Goa" },
    { src: "https://www.amazon.in/Std-5-Hindi-Grammar/dp/B08L9K9Q9P", class: "Class V", price: "₹165.00", description: "Std 5 Hindi Grammar Book, Maharashtra State Board" },

    // Class VI
    { src: "https://www.selfstudys.com/maharashtra-board-class-6-books", class: "Class VI", price: "₹160.00", description: "Maharashtra State Board Class 6 Textbooks, Marathi Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-6", class: "Class VI", price: "₹150.00", description: "Class 6 Textbooks, General Subjects, SCERT Goa" },
    { src: "https://www.amazon.in/Std-6-Science-Workbook/dp/B08L9K9Q9Q", class: "Class VI", price: "₹170.00", description: "Std 6 General Science Workbook, Maharashtra State Board" },

    // Class VII
    { src: "https://www.selfstudys.com/maharashtra-board-class-7-books", class: "Class VII", price: "₹165.00", description: "Maharashtra State Board Class 7 Textbooks, English Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-7", class: "Class VII", price: "₹155.00", description: "Class 7 Textbooks, Multi-Subject, SCERT Goa" },
    { src: "https://www.amazon.in/Std-7-Marathi-Notes/dp/B08L9K9Q9R", class: "Class VII", price: "₹175.00", description: "Std 7 Marathi Notes, Maharashtra State Board" },

    // Class VIII
    { src: "https://www.selfstudys.com/maharashtra-board-class-8-books", class: "Class VIII", price: "₹170.00", description: "Maharashtra State Board Class 8 Textbooks, Marathi Medium" },
    { src: "https://scert.goa.gov.in/text-books-class-8", class: "Class VIII", price: "₹160.00", description: "Class 8 Textbooks, General Subjects, SCERT Goa" },
    { src: "https://www.amazon.in/Std-8-Science-Guide/dp/B08L9K9Q9S", class: "Class VIII", price: "₹180.00", description: "Std 8 Science Guide, Maharashtra State Board" },

    // Class IX
    { src: "https://www.selfstudys.com/maharashtra-board-class-9-books", class: "Class IX", price: "₹175.00", description: "Maharashtra State Board Class 9 Textbooks, English Medium" },
    { src: "https://www.amazon.in/Std-9-Maths-Textbook/dp/B08L9K9Q9T", class: "Class IX", price: "₹185.00", description: "Mathematics Part 1 Textbook for Class 9, English Medium, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp", class: "Class IX", price: "₹79.00", description: "English Kumarhharati Textbook for Class 9, Latest Edition, Maharashtra State Board" },

    // Class X
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp", class: "Class X", price: "₹89.00", description: "Mathematics Part 1 Textbook for Class 10, English Medium, Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-10-Science-Technology/dp/B08L9K9Q9U", class: "Class X", price: "₹190.00", description: "Std 10 Science & Technology Books, English Medium, SSC Maharashtra State Board, Set of 2" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp", class: "Class X", price: "₹79.00", description: "English Kumarhharati Textbook for Class 10, Latest Edition, Maharashtra State Board" },

    // Class XI
    { src: "https://www.amazon.in/Std-11-English-Yuvakbharati/dp/B08L9K9Q9V", class: "Class XI", price: "₹195.00", description: "Std 11 English Yuvakbharati Notes Book, FYJC, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp", class: "Class XI", price: "₹89.00", description: "Mathematics Textbook for Class 11, English Medium, Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-11-Physics-Notes/dp/B08L9K9Q9W", class: "Class XI", price: "₹200.00", description: "Std 11 Physics Notes, FYJC Science, Maharashtra State Board" },

    // Practical NoteBooks
    { src: "https://www.amazon.in/Mathematics-Statistics-Practical-Book-Class/dp/B08L9K9Q9X", class: "Practical NoteBooks", price: "₹150.00", description: "Mathematics and Statistics Practical Book for Class 12, Arts and Science, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/science-practical-notebook.jpg", class: "Practical NoteBooks", price: "₹120.00", description: "Science Practical Notebook for Class 10, Maharashtra State Board" },
    { src: "https://www.selfstudys.com/maharashtra-board-practical-notebooks", class: "Practical NoteBooks", price: "₹130.00", description: "Practical Notebook for Class 9, Multi-Subject, Maharashtra State Board" },

    // Reference Books&Notes
    { src: "https://www.amazon.in/Navneet-Digest-Class-8-Scholarship/dp/B08L9K9Q9Y", class: "Reference Books&Notes", price: "₹250.00", description: "Navneet Class 8 Scholarship Examination Digest, English Medium, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/std-12-revision-notes.jpg", class: "Reference Books&Notes", price: "₹300.00", description: "Std 12 Revision Notes, All Subjects, Maharashtra State Board" },
    { src: "https://www.selfstudys.com/maharashtra-board-reference-books", class: "Reference Books&Notes", price: "₹280.00", description: "Reference Books for Class 11, Science Stream, Maharashtra State Board" },

    // College Books
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/02/accountancy-and-financial-management-1-fybcom-sem-1-sheth-punlication-924x1042-2.webp", class: "College Books", price: "₹290.00", description: "Accountancy and Financial Management -1 FYBCom Sem 1 | Sheth Publication | NEP 2020" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/06/FYBCOM-I-Basic-Tools-in-Economics-4-web.jpg", class: "College Books", price: "₹589.00", description: "BASIC TOOLS IN ECONOMICS | FYBCOM SEM 1 | MANAN PRAKASHAN" },
    { src: "https://www.amazon.in/BCom-Books-First-Year/dp/B08L9K9Q9Z", class: "College Books", price: "₹350.00", description: "B.Com First Year Books, Business Organization & Management" },

    // B.Com - Bachelor of Commerce
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/06/FYBCOM-I-Basic-Tools-in-Economics-4-web.jpg", class: "B.Com - Bachelor of Commerce", price: "₹589.00", description: "BASIC TOOLS IN ECONOMICS | FYBCOM SEM 1 | MANAN PRAKASHAN" },
    { src: "https://www.amazon.in/BCom-Accountancy-Financial-Management/dp/B08L9K9QA0", class: "B.Com - Bachelor of Commerce", price: "₹400.00", description: "Accountancy and Financial Management, B.Com Sem 1, Sheth Publication" },
    { src: "https://www.ncertbooks.guru/bcom-books-pdf", class: "B.Com - Bachelor of Commerce", price: "₹450.00", description: "B.Com Business Law Book, Sem 2, General Reference" },

    // Non Academic Books
    { src: "https://www.amazon.in/Lucents-General-Knowledge-2024-English/dp/B08L9K9QA1", class: "Non Academic Books", price: "₹295.00", description: "Lucent's General Knowledge 2024, English Version" },
    { src: "https://www.amazon.in/Powers-Mind-Practices-Life-Building/dp/B08L9K9QA2", class: "Non Academic Books", price: "₹150.00", description: "Powers of the Mind by Swami Vivekananda, Hindi Edition" },
    { src: "https://www.amazon.in/Motivating-Thoughts-Swami-Vivekananda/dp/B08L9K9QA3", class: "Non Academic Books", price: "₹200.00", description: "Motivating Thoughts of Swami Vivekananda" },

    // Maharashtra State Board
    { src: "https://www.selfstudys.com/maharashtra-board-class-10-books", class: "Maharashtra State Board", price: "₹89.00", description: "Mathematics Part 1 Textbook for Class 10, Maharashtra State Board" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp", class: "Maharashtra State Board", price: "₹79.00", description: "English Kumarhharati Textbook for Class 10, Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-11-Physics-Notes/dp/B08L9K9Q9W", class: "Maharashtra State Board", price: "₹200.00", description: "Std 11 Physics Notes, FYJC Science, Maharashtra State Board" },

    // SSC Board
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp", class: "SSC Board", price: "₹89.00", description: "Mathematics Part 1 Textbook for Class 10, SSC Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-10-Science-Technology/dp/B08L9K9Q9U", class: "SSC Board", price: "₹190.00", description: "Std 10 Science & Technology Books, SSC Maharashtra State Board, Set of 2" },
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/SSC-English-Kumabharti.jpg.webp", class: "SSC Board", price: "₹79.00", description: "English Kumarhharati Textbook for Class 10, SSC Maharashtra State Board" },

    // Navneet Digest
    { src: "https://www.amazon.in/Navneet-Digest-Class-8-Scholarship/dp/B08L9K9Q9Y", class: "Navneet Digest", price: "₹250.00", description: "Navneet Class 8 Scholarship Examination Digest, English Medium" },
    { src: "https://smartdigibook.com/navneet-digest-series", class: "Navneet Digest", price: "₹300.00", description: "Navneet Digest Series for Class 10, Maharashtra State Board" },
    { src: "https://www.schoolchamp.net/navneet-digest-class-12", class: "Navneet Digest", price: "₹350.00", description: "Navneet Digest for Class 12, HSC Maharashtra State Board" },

    // Mathematics
    { src: "https://harshbookcenter.com/wp-content/uploads/2025/01/maths-1-algebra-10th-standard-ssc-maharashtra-state-board_6_3c1a2739ef74455990da08f3e1b1d605.png.webp", class: "Mathematics", price: "₹89.00", description: "Mathematics Part 1 Textbook for Class 10, Maharashtra State Board" },
    { src: "https://www.amazon.in/Std-9-Maths-Textbook/dp/B08L9K9Q9T", class: "Mathematics", price: "₹185.00", description: "Mathematics Part 1 Textbook for Class 9, English Medium, Maharashtra State Board" },
    { src: "https://www.amazon.in/Complete-Mathematics-Ankit-Bhati/dp/B08L9K9QA4", class: "Mathematics", price: "₹300.00", description: "Complete Mathematics Bilingual Book 2025, Ankit Bhati & Rahul Sir" },

    // Investing
    { src: "https://www.amazon.in/Intelligent-Investor-Definitive-Investing-Essentials/dp/B08L9K9QA5", class: "Investing", price: "₹499.00", description: "The Intelligent Investor by Benjamin Graham" },
    { src: "https://www.amazon.in/Rich-Dad-Poor-Dad/dp/B08L9K9QA6", class: "Investing", price: "₹350.00", description: "Rich Dad Poor Dad by Robert Kiyosaki" },
    { src: "https://www.amazon.in/Investing-Stock-Markets-BCom/dp/B08L9K9QA7", class: "Investing", price: "₹400.00", description: "Investing in Stock Markets, B.Com Reference Book" },

    // Business
    { src: "https://www.amazon.in/Business-Organisation-Management-BCom/dp/B08L9K9QA8", class: "Business", price: "₹350.00", description: "Business Organisation & Management, B.Com First Year" },
    { src: "https://www.amazon.in/Organisation-Commerce-Management-12th/dp/B08L9K9QA9", class: "Business", price: "₹300.00", description: "Organisation of Commerce and Management, Class 12, Maharashtra State Board" },
    { src: "https://www.amazon.in/Business-Studies-Goyal-Brothers/dp/B08L9K9QAA", class: "Business", price: "₹400.00", description: "Business Studies, Class 12 ISC, Goyal Brothers" },

    // Commerce
    { src: "https://www.amazon.in/Commerce-Volume-2-CB-Gupta/dp/B08L9K9QAB", class: "Commerce", price: "₹350.00", description: "Commerce Volume 2, Class 12 ISC, CB Gupta" },
    { src: "https://www.amazon.in/Secretarial-Practice-12th-Maharashtra/dp/B08L9K9QAC", class: "Commerce", price: "₹300.00", description: "Secretarial Practice, Class 12, Maharashtra State Board" },
    { src: "https://www.amazon.in/Organisation-Commerce-Management-11th/dp/B08L9K9QAD", class: "Commerce", price: "₹280.00", description: "Organisation of Commerce and Management, Class 11, Maharashtra State Board" },

    // Personal Finance
    { src: "https://www.amazon.in/Personal-Finance-Robert-Kiyosaki/dp/B08L9K9QAE", class: "Personal Finance", price: "₹400.00", description: "Personal Finance by Robert Kiyosaki" },
    { src: "https://www.amazon.in/Rich-Dad-Guide-Investing/dp/B08L9K9QAF", class: "Personal Finance", price: "₹450.00", description: "Rich Dad's Guide to Investing" },
    { src: "https://www.amazon.in/Financial-Planning-Money-Management/dp/B08L9K9QAG", class: "Personal Finance", price: "₹350.00", description: "Financial Planning and Money Management" },

    // Psychology
    { src: "https://www.amazon.in/Psychology-Class-12-Maharashtra/dp/B08L9K9QAH", class: "Psychology", price: "₹300.00", description: "Psychology Textbook, Class 12, Maharashtra State Board" },
    { src: "https://www.amazon.in/Introduction-Psychology-Girishbala-Mohanty/dp/B08L9K9QAI", class: "Psychology", price: "₹350.00", description: "Introduction to Psychology, Class 12 ISC, Girishbala Mohanty" },
    { src: "https://www.amazon.in/Psychology-Self-Discovery/dp/B08L9K9QAJ", class: "Psychology", price: "₹400.00", description: "Psychology of Self-Discovery" },

    // Philosophy
    { src: "https://www.amazon.in/Introduction-Philosophy-Basic-Concepts/dp/B08L9K9QAK", class: "Philosophy", price: "₹450.00", description: "Introduction to Philosophy, Basic Concepts" },
    { src: "https://www.amazon.in/Philosophy-Eastern-Western-Traditions/dp/B08L9K9QAL", class: "Philosophy", price: "₹500.00", description: "Philosophy: Eastern and Western Traditions" },
    { src: "https://www.amazon.in/Ethics-Philosophical-Perspectives/dp/B08L9K9QAM", class: "Philosophy", price: "₹400.00", description: "Ethics: Philosophical Perspectives" },

    // Fiction
    { src: "https://www.amazon.in/Harry-Potter-Philosophers-Stone-Rowling/dp/B08L9K9QAN", class: "Fiction", price: "₹399.00", description: "Harry Potter and the Philosopher's Stone by J.K. Rowling" },
    { src: "https://www.amazon.in/Lord-Rings-Fellowship-Ring/dp/B08L9K9QAO", class: "Fiction", price: "₹499.00", description: "The Lord of the Rings: The Fellowship of the Ring by J.R.R. Tolkien" },
    { src: "https://www.amazon.in/1984-George-Orwell/dp/B08L9K9QAP", class: "Fiction", price: "₹250.00", description: "1984 by George Orwell" },

    // Romance
    { src: "https://www.amazon.in/Pride-Prejudice-Jane-Austen/dp/B08L9K9QAQ", class: "Romance", price: "₹199.00", description: "Pride and Prejudice by Jane Austen" },
    { src: "https://www.amazon.in/Novel-Romance-Contemporary-Love-Stories/dp/B08L9K9QAR", class: "Romance", price: "₹300.00", description: "Contemporary Romance Novel Collection" },
    { src: "https://www.amazon.in/Jane-Eyre-Charlotte-Bronte/dp/B08L9K9QAS", class: "Romance", price: "₹250.00", description: "Jane Eyre by Charlotte Bronte" },

    // Self-Help
    { src: "https://www.amazon.in/7-Habits-Highly-Effective-People/dp/B08L9K9QAT", class: "Self-Help", price: "₹399.00", description: "The 7 Habits of Highly Effective People by Stephen Covey" },
    { src: "https://www.amazon.in/Think-Grow-Rich-Napoleon-Hill/dp/B08L9K9QAU", class: "Self-Help", price: "₹299.00", description: "Think and Grow Rich by Napoleon Hill" },
    { src: "https://www.amazon.in/Power-Now-Spiritual-Enlightenment/dp/B08L9K9QAV", class: "Self-Help", price: "₹350.00", description: "The Power of Now by Eckhart Tolle" },

    // Uncategorized
    { src: "https://www.amazon.in/Miscellaneous-Books-Collection/dp/B08L9K9QAW", class: "Uncategorized", price: "₹200.00", description: "Miscellaneous Books Collection, Various Authors" },
    { src: "https://www.amazon.in/General-Knowledge-Miscellaneous/dp/B08L9K9QAX", class: "Uncategorized", price: "₹250.00", description: "General Knowledge Miscellaneous Edition" },
    { src: "https://www.amazon.in/Variety-Books-Uncategorized/dp/B08L9K9QAY", class: "Uncategorized", price: "₹300.00", description: "Variety of Books, Uncategorized Category" },
  ];

    // State for filters
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string>("");
    const [status, setStatus] = useState<string>("");
    const [booksToShow, setBooksToShow] = useState<number>(8);
    const [sortOption, setSortOption] = useState<string>("default");
    const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

    // Extract numeric price for sorting
    const getNumericPrice = (price: string) => {
        return parseFloat(price.replace("₹", "").replace(",", ""));
    };

    // Count books per category for display
    const bookCountPerCategory: Record<string, number> = categories.reduce((acc, category) => {
        acc[category] = books.filter((book) => book.class === category).length;
        return acc;
    }, {} as Record<string, number>);

    // Filter and sort books
    const filteredBooks = books
        .filter((book) => {
            const matchesCategory = selectedCategories.length === 0 || selectedCategories.includes(book.class);
            const matchesPrice = priceRange === "" ||
                (priceRange === "0to500" && getNumericPrice(book.price) <= 500) ||
                (priceRange === "500to1000" && getNumericPrice(book.price) > 500 && getNumericPrice(book.price) <= 1000) ||
                (priceRange === "1000to1500" && getNumericPrice(book.price) > 1000 && getNumericPrice(book.price) <= 1500) ||
                (priceRange === "1500to2000" && getNumericPrice(book.price) > 1500 && getNumericPrice(book.price) <= 2000);
            const matchesStatus = status === "" || status === "inStock" || status === "outOfStock" || status === "onSale"; // Placeholder, assumes all books are in stock for now
            return matchesCategory && matchesPrice && matchesStatus;
        })
        .sort((a, b) => {
            if (sortOption === "price-low-high") {
                return getNumericPrice(a.price) - getNumericPrice(b.price);
            } else if (sortOption === "price-high-low") {
                return getNumericPrice(b.price) - getNumericPrice(a.price);
            }
            return 0; // Default no sorting
        })
        .slice(0, booksToShow);

    // Handle category filter
    const handleCategoryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const category = e.target.id;
        setSelectedCategories((prev) =>
            e.target.checked ? [...prev, category] : prev.filter((c) => c !== category)
        );
    };

    // Handle price filter
    const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPriceRange(e.target.id);
    };

    // Handle status filter
    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setStatus(e.target.id);
    };

    // Handle books to show
    const handleBooksToShowChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const value = e.target.value;
        setBooksToShow(value === "all" ? books.length : parseInt(value));
    };

    // Handle sort option
    const handleSortChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSortOption(e.target.value);
    };

    useEffect(() => {
        // Reset booksToShow to default when filters change to ensure all filtered books are visible
        setBooksToShow(books.length);
    }, [selectedCategories, priceRange, status, sortOption]);

    interface Book {
        src: string;
        alt?: string;
        price: string;
        description: string;
        class: string;
    }

    type ViewMode = "grid" | "list";

    interface HandleViewToggle {
        (mode: ViewMode): void;
    }

    const handleViewToggle: HandleViewToggle = (mode) => {
        setViewMode(mode);
    };

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <Header />
            <main className="flex-grow px-29 py-6">
                <div className="flex">
                    {/* Left Sidebar for Categories and Filters */}
                    <aside className="w-1/4 pr-6">
                        <h2 className="text-2xl font-semibold mb-4 text-black">Categories</h2>
                        <div className="border rounded-lg p-4 bg-white shadow-md mb-6">
                            {categories.map((category) => (
                                <div key={category} className="flex items-center mb-2">
                                    <input
                                        type="checkbox"
                                        id={category}
                                        className="mr-2 accent-orange-500"
                                        onChange={handleCategoryChange}
                                    />
                                    <label htmlFor={category} className="text-gray-400 text-sm">
                                        {bookCountPerCategory[category] > 0
                                            ? `${category} - ${bookCountPerCategory[category]} books`
                                            : category}
                                    </label>
                                </div>
                            ))}
                        </div>

                        {/* Filter by Price */}
                        <h2 className="text-xl font-semibold mb-4 text-black">Filter by Price</h2>
                        <div className="border rounded-lg p-4 bg-white shadow-md mb-6">
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="0to500"
                                    name="price"
                                    className="mr-2 accent-orange-500"
                                    onChange={handlePriceChange}
                                />
                                <label htmlFor="0to500" className="text-gray-400 text-sm">
                                    ₹0 - ₹500
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="500to1000"
                                    name="price"
                                    className="mr-2 accent-orange-500"
                                    onChange={handlePriceChange}
                                />
                                <label htmlFor="500to1000" className="text-gray-400 text-sm">
                                    ₹500 - ₹1,000
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="1000to1500"
                                    name="price"
                                    className="mr-2 accent-orange-500"
                                    onChange={handlePriceChange}
                                />
                                <label htmlFor="1000to1500" className="text-gray-400 text-sm">
                                    ₹1,000 - ₹1,500
                                </label>
                            </div>
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="1500to2000"
                                    name="price"
                                    className="mr-2 accent-orange-500"
                                    onChange={handlePriceChange}
                                />
                                <label htmlFor="1500to2000" className="text-gray-400 text-sm">
                                    ₹1,500 - ₹2,000
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id=""
                                    name="price"
                                    className="mr-2 accent-orange-500"
                                    onChange={() => setPriceRange("")}
                                    defaultChecked
                                />
                                <label className="text-gray-400 text-sm">All</label>
                            </div>
                        </div>

                        {/* Product Status */}
                        <h2 className="text-xl font-semibold mb-4 text-black">Product Status</h2>
                        <div className="border rounded-lg p-4 bg-white shadow-md">
                            <div className="flex items-center mb-2">
                                <input
                                    type="radio"
                                    id="inStock"
                                    name="status"
                                    className="mr-2 accent-orange-500"
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="inStock" className="text-gray-400 text-sm">
                                    In Stock
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="outOfStock"
                                    name="status"
                                    className="mr-2 accent-orange-500"
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="outOfStock" className="text-gray-400 text-sm">
                                    Out of Stock
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id="onSale"
                                    name="status"
                                    className="mr-2 accent-orange-500"
                                    onChange={handleStatusChange}
                                />
                                <label htmlFor="onSale" className="text-gray-400 text-sm">
                                    On Sale
                                </label>
                            </div>
                            <div className="flex items-center">
                                <input
                                    type="radio"
                                    id=""
                                    name="status"
                                    className="mr-2 accent-orange-500"
                                    onChange={() => setStatus("")}
                                    defaultChecked
                                />
                                <label className="text-gray-400 text-sm">All</label>
                            </div>
                        </div>
                    </aside>

                    {/* Right Section for Books */}
                    <section className="w-3/4 pl-6">
                        <h2 className="text-2xl font-semibold mb-4 text-black">School TextBooks</h2>
                        <div className="mb-4 flex justify-between items-center">
                            {/* Left Side: Icons */}
                            <div className="flex items-center">
                                {/* 4-Column Grid Icon */}
                                <span
                                    className="mr-2 text-3xl cursor-pointer"
                                    onClick={() => handleViewToggle("grid")}
                                >
                                    <FontAwesomeIcon
                                        icon={faThLarge}
                                        className={`text-black ${viewMode === "grid" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                                    />
                                </span>

                                {/* List-Grid Toggle */}
                                <span
                                    className="cursor-pointer ml-4 text-3xl"
                                    onClick={() => handleViewToggle("list")}
                                >
                                    <FontAwesomeIcon
                                        icon={faList}
                                        className={`text-black ${viewMode === "list" ? "text-orange-500" : ""} hover:text-orange-500 transition-colors duration-300`}
                                    />
                                </span>
                            </div>

                            {/* Right Side: Selects */}
                            <div className="flex space-x-4">
                                {/* Number of Books to Show */}
                                <select
                                    className="border rounded p-1 text-lg text-black"
                                    onChange={handleBooksToShowChange}
                                    value={booksToShow === books.length ? "all" : booksToShow.toString()}
                                >
                                    <option value="12">12</option>
                                    <option value="24">24</option>
                                    <option value="36">36</option>
                                    <option value="all">Show All</option>
                                </select>

                                {/* Sorting Options */}
                                <select className="border rounded p-1 text-lg text-black" onChange={handleSortChange} value={sortOption}>
                                    <option value="default">Default Sorting</option>
                                    <option value="price-low-high">Price: Low to High</option>
                                    <option value="price-high-low">Price: High to Low</option>
                                </select>
                            </div>
                        </div>
                        <div
                            className={`grid gap-6 ${
                                viewMode === "grid" ? "grid-cols-4" : "grid-cols-1"
                            }`}
                            style={{
                                maxHeight: viewMode === "list" ? "600px" : "auto",
                                overflowY: viewMode === "list" ? "auto" : "visible",
                            }}
                        >
                            {filteredBooks.map((book, index) => (
                                <div
                                    key={index}
                                    className={`border rounded-lg overflow-hidden shadow-md ${
                                        viewMode === "list" ? "w-full max-w-2xl mx-auto" : ""
                                    }`}
                                >
                                    <Image
                                        src={book.src}
                                        alt={book.description}
                                        width={150}
                                        height={169}
                                        className="w-full h-auto"
                                    />
                                    <div className="p-2 text-center">
                                        <p className="text-gray-500 text-xs mt-1">{book.class}</p>
                                        <p className="text-gray-600 text-m font-bold mt-1">{book.description}</p>
                                        <p className="text-orange-500 font-bold mt-1">{book.price}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </section>
                </div>
            </main>
            <Footer />
        </div>
    );
}

function setViewMode(mode: string) {
    throw new Error("Function not implemented.");
}
