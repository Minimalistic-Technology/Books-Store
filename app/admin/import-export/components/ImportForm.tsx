// "use client";

// import { useState, useEffect } from "react";

// import Papa, { ParseResult } from "papaparse";
// import { User } from "./ExportForm";
// import { API_BASE_URL } from '../../../../utils/api';
// import { Category, Content } from "../../order-product-management/types";

// interface ImportFormProps {
//   onImport: (
//     data:
//       | { type: "users"; file: File | null; parsedData: User[] }
//       | { type: "products"; file: File | null; parsedData: Content[] }
//   ) => void;
// }

// interface UserRow {
//   username: string;
//   email: string;
// }

// interface ProductRow {
//   title: string;
//   category: string;
//   subcategory: string;
//   tags: string;
//   author: string;
//   publisher: string;
//   price: string;
//   condition: string;
//   "new quantity": string;
//   "discount for new books (%)": string;
//   "old quantity": string;
//   "discount for old books (%)": string;
//   "valid image link": string;
//   "estimated delivery": string;
//   description: string;
//   "seo title": string;
//   "seo description": string;
// }

// export default function ImportForm({ onImport }: ImportFormProps) {
//   const [selectedFile, setSelectedFile] = useState<File | null>(null);
//   const [error, setError] = useState<string | null>(null);
//   const [categories, setCategories] = useState<string[]>([]);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/book-categories`);
//         if (!response.ok) throw new Error("Failed to fetch categories");
//         const data = await response.json();
//         setCategories(data.map((cat: Category) => cat.name));
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//         setError("Failed to load categories");
//       }
//     };
//     fetchCategories();
//   }, []);

//   const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     if (!selectedFile) {
//       setError("No file selected.");
//       return;
//     }

//     const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase() ?? "";
//     if (!["csv", "xlsx"].includes(fileExtension)) {
//       setError("Please upload a CSV or Excel (.xlsx) file.");
//       return;
//     }

//     const form = e.target as HTMLFormElement;
//     const type = (form.elements.namedItem("type") as HTMLSelectElement).value as
//       | "users"
//       | "products";

//     const reader = new FileReader();
//     reader.onload = async (e: ProgressEvent<FileReader>) => {
//       const text = e.target?.result as string;
//       
//       let parsedData: User[] | Content[] | null = null;

//       try {
//         const result: ParseResult<UserRow | ProductRow> = Papa.parse(text, {
//           header: true,
//           skipEmptyLines: "greedy",
//           transformHeader: (header: string) => header.trim().toLowerCase(),
//           transform: (value: string) => value.trim(),
//           delimiter: ",",
//           quoteChar: '"',
//           escapeChar: '"',
//           dynamicTyping: false,
//           complete: (results) => {
//             results.data = results.data.filter((row) => {
//               const fieldCount = Object.keys(row).length;
//               if (fieldCount < 17) {
//                 console.warn(`Skipping row with ${fieldCount} fields:`, row);
//                 return false;
//               }
//               return true;
//             });
//           },
//         });

//         if (result.errors.length > 0) {
//           throw new Error(
//             `CSV parsing error: ${result.errors
//               .map((e) => `Row ${e.row ? e.row + 2 : "unknown"}: ${e.message}`)
//               .join("; ")}`
//           );
//         }

//         const dataLines = result.data;
//         if (dataLines.length === 0) {
//           throw new Error("CSV file is empty or has no valid data rows.");
//         }

//         if (type === "users") {
//           const requiredHeaders = ["username", "email"];
//           if (!requiredHeaders.every((h) => result.meta.fields?.includes(h))) {
//             throw new Error("CSV must contain 'username' and 'email' columns.");
//           }

//           parsedData = dataLines
//             .map((row, i) => {
//               if (!row.username || !row.email) {
//                 throw new Error(`Missing username or email at row ${i + 2}`);
//               }
//               return { username: row.username, email: row.email } as User;
//             })
//             .filter((user) => user.username && user.email);
//         } else if (type === "products") {
//           const requiredHeaders = [
//             "title",
//             "category",
//             "subcategory",
//             "tags",
//             "author",
//             "publisher",
//             "price",
//             "condition",
//             "new quantity",
//             "discount for new books (%)",
//             "old quantity",
//             "discount for old books (%)",
//             "valid image link",
//             "estimated delivery",
//             "description",
//             "seo title",
//             "seo description",
//           ];

//           if (!requiredHeaders.every((h) => result.meta.fields?.includes(h))) {
//             throw new Error(`Missing one or more required columns: ${requiredHeaders.join(", ")}`);
//           }

//           // Explicitly type parsedData as Content[]
//           parsedData = [] as Content[];
//           for (const [index, row] of dataLines.entries()) {
//             const category = row.category;
//             if (!categories.includes(category)) {
//               console.warn(`Skipping row ${index + 2}: Invalid category "${category}"`);
//               continue;
//             }

//             try {
//               const tagRes = await fetch(
//                 `${API_BASE_URL}/book-categories/${encodeURIComponent(category)}/tags`
//               );
//               if (!tagRes.ok) throw new Error(`Could not fetch tags for ${category}`);
//               const tagData = await tagRes.json();
//               if (!tagData.tags.includes(row.subcategory)) {
//                 console.warn(
//                   `Skipping row ${index + 2}: Invalid subcategory "${row.subcategory}" for category "${category}"`
//                 );
//                 continue;
//               }
//             } catch (err) {
//               console.warn(`Skipping row ${index + 2}: Failed to validate subcategory: ${(err as Error).message}`);
//               continue;
//             }

//             const imageUrl = row["valid image link"];
//             const defaultImage = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";
//             if (
//               imageUrl &&
//               imageUrl !== defaultImage &&
//               !imageUrl.startsWith("https://res.cloudinary.com/")
//             ) {
//               console.warn(
//                 `Skipping row ${index + 2}: Invalid image URL: must be a valid Cloudinary URL or the default image`
//               );
//               continue;
//             }

//             const condition = row.condition;
//             if (!["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(condition)) {
//               console.warn(`Skipping row ${index + 2}: Invalid condition "${row.condition}"`);
//               continue;
//             }

//             const tags = row.tags && row.tags.trim() ? row.tags : "General";

//             const requiredFields = {
//               title: row.title,
//               categoryName: category,
//               subCategory: row.subcategory,
//               tags: tags,
//               author: row.author,
//               publisher: row.publisher,
//               price: row.price,
//               condition: condition,
//               imageUrl: imageUrl || defaultImage,
//               estimatedDelivery: row["estimated delivery"],
//               description: row.description,
//             };

//             const missingFields = Object.entries(requiredFields)
//               .filter(([_, value]) => !value || value === "")
//               .map(([key]) => key);

//             if (missingFields.length > 0) {
//               console.warn(`Skipping row ${index + 2}: Missing required fields: ${missingFields.join(", ")}`);
//               continue;
//             }

//             const product: Content = {
//               id: "",
//               title: row.title,
//               categoryName: category,
//               subCategory: row.subcategory,
//               tags: tags,
//               author: row.author,
//               publisher: row.publisher,
//               price: parseFloat(row.price) || 0,
//               condition: condition,
//               quantityNew: parseInt(row["new quantity"], 10) || 0,
//               discountNew: parseFloat(row["discount for new books (%)"]) || 0,
//               quantityOld: parseInt(row["old quantity"], 10) || 0,
//               discountOld: parseFloat(row["discount for old books (%)"]) || 0,
//               imageUrl: imageUrl || defaultImage,
//               estimatedDelivery: row["estimated delivery"],
//               description: row.description,
//               seoTitle: row["seo title"] || row.title,
//               seoDescription: row["seo description"] || row.description,
//               categoryPath: `${category}/${row.subcategory}`,
//             };

//             if (product.price <= 0) {
//               console.warn(`Skipping row ${index + 2}: Price must be greater than 0`);
//               continue;
//             }

//             (parsedData as Content[]).push(product);
//           }
//         }

//         if (!parsedData || parsedData.length === 0) {
//           throw new Error("No valid data found in the file after validation.");
//         }

//         if (type === "users") {
//           onImport({ type: "users", file: selectedFile, parsedData: parsedData as User[] });
//         } else {
//           onImport({ type: "products", file: selectedFile, parsedData: parsedData as Content[] });
//         }
//         setError(null);
//       } catch (err) {
//         setError((err as Error).message || "Failed to parse file.");
//         console.error("Parsing error details:", err);
//       }
//     };

//     reader.readAsText(selectedFile);
//   };

//   const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     const file = e.target.files?.[0] || null;
//     if (file) {
//       const fileExtension = file.name.split(".").pop()?.toLowerCase() ?? "";
//       if (!["csv", "xlsx"].includes(fileExtension)) {
//         setError("Only CSV or Excel (.xlsx) files are allowed.");
//         setSelectedFile(null);
//       } else {
//         setSelectedFile(file);
//         setError(null);
//       }
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="space-y-4">
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Data Type</label>
//         <select
//           name="type"
//           defaultValue="users"
//           className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500"
//         >
//           <option value="users">Users</option>
//           <option value="products">Products</option>
//         </select>
//       </div>
//       <div>
//         <label className="block text-sm font-medium text-gray-700">Upload File</label>
//         <input
//           type="file"
//           name="file"
//           accept=".csv,.xlsx"
//           onChange={handleFileChange}
//           className="w-full border border-gray-300 rounded-md p-2"
//         />
//         {error ? (
//           <p className="text-sm text-red-500 mt-1">{error}</p>
//         ) : (
//           <p className="text-sm text-gray-500 mt-1">
//             {selectedFile ? selectedFile.name : "No file selected"}
//           </p>
//         )}
//       </div>
//       <button
//         type="submit"
//         className={`btn-primary w-full ${!selectedFile ? "opacity-50 cursor-not-allowed" : ""}`}
//         disabled={!selectedFile}
//       >
//         Import
//       </button>
//     </form>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import Papa, { ParseResult } from "papaparse";
import { User } from "./ExportForm";
import { API_BASE_URL } from "../../../../utils/api";
import { Category, Content } from "../../order-product-management/types";

interface ImportFormProps {
  onImport: (
    data:
      | { type: "users"; file: File | null; parsedData: User[] }
      | { type: "products"; file: File | null; parsedData: Content[] }
  ) => void;
}

interface UserRow {
  username: string;
  email: string;
}

interface ProductRow {
  bookName:string;
  title: string;
  category: string;
  categoryPath: string;
  subcategory: string;
  tags: string;
  author: string;
  publisher: string;
  price: string;
  condition: string;
  "new quantity": string;
  "discount for new books (%)": string;
  "old quantity": string;
  "discount for old books (%)": string;
  "valid image link": string;
  "estimated delivery": string;
  description: string;
  "seo title": string;
  "seo description": string;
}

export default function ImportForm({ onImport }: ImportFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<string[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/book-categories`);
        if (!response.ok) throw new Error("Failed to fetch categories");
        const data = await response.json();
        setCategories(data.map((cat: Category) => cat.name));
      } catch (error) {
        console.error("Failed to fetch categories:", error);
        setError("Failed to load categories");
      }
    };
    fetchCategories();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setError("No file selected.");
      return;
    }

    const fileExtension = selectedFile.name.split(".").pop()?.toLowerCase();
    if (fileExtension !== "csv") {
      setError("Only CSV files are supported. Please convert .xlsx to .csv.");
      return;
    }

    const form = e.currentTarget;
    const type = (form.elements.namedItem("type") as HTMLSelectElement)
      .value as "users" | "products";

    const reader = new FileReader();
    reader.onload = async (event: ProgressEvent<FileReader>) => {
      const text = event.target?.result as string;
      let parsedData: User[] | Content[] = [];

      try {
        const result: ParseResult<UserRow | ProductRow> = Papa.parse(text, {
          header: true,
          skipEmptyLines: true,
          transformHeader: (header: string) => header.trim().toLowerCase(),
          transform: (value: string) => value.trim(),
        });

        if (result.errors.length > 0) {
          throw new Error(
            result.errors
              .map((e) => `Row ${e.row ? e.row + 2 : "unknown"}: ${e.message}`)
              .join("; ")
          );
        }

        const rows = result.data;

        if (type === "users") {
          parsedData = rows
            .map((row) => {
              const u = row as UserRow;
              if (!u.username || !u.email) return null;
              return { username: u.username, email: u.email } as User;
            })
            .filter((u): u is User => u !== null);
        } else {
          parsedData = await Promise.all(
            rows.map(async (row, index) => {
              const p = row as ProductRow;
              if (!categories.includes(p.category)) return null;

              const imageUrl = p["valid image link"];
              const defaultImage =
                "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

              if (
                imageUrl &&
                imageUrl !== defaultImage &&
                !imageUrl.startsWith("https://res.cloudinary.com/")
              ) {
                console.warn(`Row ${index + 2}: Invalid image URL`);
                return null;
              }

              if (
                !["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(p.condition)
              ) {
                console.warn(`Row ${index + 2}: Invalid condition`);
                return null;
              }

              return {
                bookName:p.bookName,
                title: p.title,
                categoryName: p.category,
                subCategory: p.subcategory,
                tags: p.tags || "General",
                author: p.author,
                publisher: p.publisher,
                price: parseFloat(p.price) || 0,
                condition: p.condition,
                quantityNew: parseInt(p["new quantity"], 10) || 0,
                discountNew: parseFloat(p["discount for new books (%)"]) || 0,
                quantityOld: parseInt(p["old quantity"], 10) || 0,
                discountOld: parseFloat(p["discount for old books (%)"]) || 0,
                imageUrl: imageUrl || defaultImage,
                estimatedDelivery: p["estimated delivery"],
                description: p.description,
                seoTitle: p["seo title"] || p.title,
                seoDescription: p["seo description"] || p.description,
                categoryPath: `${p.category}/${p.subcategory}`,
              } as Content;
            })
          ).then((list) => list.filter((p): p is Content => p !== null));
        }

        if (!parsedData.length) {
          throw new Error("No valid data found in file.");
        }

        if (type === "users") {
          onImport({
            type: "users",
            file: selectedFile,
            parsedData: parsedData as User[],
          });
        } else {
          onImport({
            type: "products",
            file: selectedFile,
            parsedData: parsedData as Content[],
          });
        }

        setError(null);
      } catch (err) {
        console.error("Parsing error:", err);
        setError((err as Error).message);
      }
    };

    reader.readAsText(selectedFile);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setSelectedFile(file);
    setError(null);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Data Type
        </label>
        <select
          name="type"
          defaultValue="users"
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-teal-500"
        >
          <option value="users">Users</option>
          <option value="products">Products</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload File
        </label>
        <input
          type="file"
          name="file"
          accept=".csv"
          onChange={handleFileChange}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {error ? (
          <p className="text-sm text-red-500 mt-1">{error}</p>
        ) : (
          <p className="text-sm text-gray-500 mt-1">
            {selectedFile ? selectedFile.name : "No file selected"}
          </p>
        )}
      </div>
      <button
        type="submit"
        className={`btn-primary w-full ${
          !selectedFile ? "opacity-50 cursor-not-allowed" : ""
        }`}
        disabled={!selectedFile}
      >
        Import
      </button>
    </form>
  );
}
