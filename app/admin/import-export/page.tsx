/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import ImportForm from "./components/ImportForm";
import ExportForm from "./components/ExportForm";

// import { User } from "./components/ExportForm";
import { API_BASE_URL } from "../../../utils/api";
import { Content, User } from "../order-product-management/types";

type APIError = {
  errors?: { error: string }[];
  error?: string;
  [key: string]: unknown;
};

export default function ImportExportManagement() {
  const [error, setError] = useState<string>("");
  const [successMessage, setSuccessMessage] = useState<string>("");
  // const [selectedCategory, setSelectedCategory] = useState([]);
  // const [uploadedData, setUploadedData] = useState<any>([]);
  // const [isCategoryPresent, setIsCategoryPresent] = useState<any>([]);

  // useEffect(() => {
  //   const fetchCategories = async () => {

  //
  //       setSelectedCategory(matchedCategory[0]?.children);

  //   };
  //   fetchCategories();
  // }, []);

  // useEffect(() => {
  //
  //   if (selectedCategory?.length > 0) {
  //
  //     const isCategoryFound = selectedCategory.find(
  //       (cat: any) => cat.name === uploadedData[0].subCategory
  //     );
  //
  //     setIsCategoryPresent(isCategoryFound);
  //   }
  // }, [selectedCategory]);

  // const mapCategories = (categoriesArray: any) => {
  //   categoriesArray.map((category: any) => {
  //     if (category.children) mapCategories(category.children);
  //     else return categoriesArray;
  //   });
  // };

  const handleImport = async (
    data:
      | { type: "users"; file: File | null; parsedData: User[] }
      | { type: "products"; file: File | null; parsedData: Content[] }
  ) => {
    try {
      if (data.type === "users") {
        // Validate users
        const validatedUsers = data.parsedData;
        if (!validatedUsers.length) {
          throw new Error("No valid users found in uploaded data.");
        }

        const response = await fetch(`${API_BASE_URL}/users/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ users: validatedUsers }),
          credentials: "include",
        });

        const result = await response.json();


        
        if (!response.ok) {
          throw new Error(result.message || "Failed to import users");
        }

        setSuccessMessage("Users imported successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else if (data.type === "products") {
        const productsByCategory: { [key: string]: Content[] } = {};
        data.parsedData.forEach((product: Content) => {
          if (!productsByCategory[product.categoryName]) {
            productsByCategory[product.categoryName] = [];
          }
          productsByCategory[product.categoryName].push(product);
        });

        const importPromises = Object.entries(productsByCategory).map(
          async ([category, products]) => {
            const validatedProducts = products.map((product: Content) => {
              const tagsArray =
                product.tags && product.tags.trim()
                  ? product.tags
                      .split(",")
                      .map((tag) => tag.trim())
                      .filter(Boolean)
                  : ["General"];

              if (
                !product.title ||
                !product.categoryName ||
                !product.subCategory ||
                !tagsArray.length ||
                !product.price ||
                !product.description ||
                !product.estimatedDelivery ||
                !product.condition ||
                !product.author ||
                !product.publisher ||
                !product.imageUrl
              ) {
                throw new Error(
                  `Invalid product data for "${
                    product.title || "unknown"
                  }": Missing required fields`
                );
              }

              if (
                !["NEW - ORIGINAL PRICE", "OLD", "BOTH"].includes(
                  product.condition
                )
              ) {
                throw new Error(
                  `Invalid condition "${product.condition}" for "${
                    product.title || "unknown"
                  }"`
                );
              }

              return {
                bookName: product.bookName || product.title,
                title: product.title,
                categoryName: product.categoryName,
                categoryPath: product.categoryPath,
                subCategory: product.subCategory,
                tags: tagsArray,
                author: product.author,
                publisher: product.publisher,
                price: product.price,
                condition: product.condition,
                quantityNew: product.quantityNew || 0,
                discountNew: product.discountNew || 0,
                quantityOld: product.quantityOld || 0,
                discountOld: product.discountOld || 0,
                imageUrl: product.imageUrl,
                estimatedDelivery: product.estimatedDelivery,
                description: product.description,
                seoTitle: product.seoTitle || product.title,
                seoDescription: product.seoDescription || product.description,
              };
            });

            // setUploadedData(validatedProducts);

            //
            const categoriesResponse = await fetch(
              `${API_BASE_URL}/book-categories`,
              { credentials: "include" }
            );
            const data = await categoriesResponse.json();

            const matchedCategory = data.filter((el: any) =>
              el.name === validatedProducts[0]?.categoryName ? el : false
            );

            const isCategoryFound = matchedCategory[0].children.find(
              (cat: any) => cat.name === validatedProducts[0].subCategory
            );

            if (!isCategoryFound) {
              const response = await fetch(`${API_BASE_URL}/book-categories`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  name: validatedProducts[0]?.subCategory.trim(),
                  parentPath: validatedProducts[0]?.categoryName.trim(),
                }),
                credentials: "include",
              });

              if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to create category");
              }
              // const data = await response.json();
            }

            // );

            const response = await fetch(
              `${API_BASE_URL}/products/bulk`,
              // `${API_BASE_URL}/book-categories/${encodeURIComponent(category)}`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ products: validatedProducts }),
                credentials: "include",
              }
            );

            if (!response.ok) {
              const errorData: APIError = await response
                .json()
                .catch(() => ({}));
              throw new Error(
                `Failed to import products for ${category}: ${
                  errorData.errors?.map((e) => e.error).join("; ") ||
                  errorData.error ||
                  JSON.stringify(errorData)
                }`
              );
            }

            return response.json();
          }
        );

        await Promise.all(importPromises);
        setSuccessMessage("Products imported successfully");
        setTimeout(() => setSuccessMessage(""), 3000);
      }
    } catch (err) {
      if (err instanceof Error) {
        
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        
        setError("Failed to import data");
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  const handleExport = (data: { type: string; format: string }) => {
    try {
      setSuccessMessage(`Exporting ${data.type} in ${data.format} format`);
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
        setTimeout(() => setError(""), 5000);
      } else {
        setError("Failed to export data");
        setTimeout(() => setError(""), 5000);
      }
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Import/Export Management
      </h1>

      {successMessage && (
        <div className="bg-teal-50 border border-teal-200 text-teal-700 px-4 py-3 rounded-lg mb-6">
          {successMessage}
        </div>
      )}

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Import Data
          </h2>
          <ImportForm onImport={handleImport} />
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Export Data
          </h2>
          <ExportForm onExport={handleExport} />
        </div>
      </div>
    </div>
  );
}
