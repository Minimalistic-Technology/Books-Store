// // File: components/ProductList.tsx
// "use client";

// import type { Product } from "../types";

// type ProductListProps = {
//   products: Product[];
//   onEdit: (product: Product) => void;
//   onDelete: (id: string) => void;
// };

// export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
//   const handleDelete = async (id: string) => {
//     if (confirm("Are you sure you want to delete this product?")) {
//       try {
//         const response = await fetch(`http://localhost:5000/api/bookstore/productroutes/products/${id}`, {
//           method: "DELETE",
//         });
//         if (!response.ok) throw new Error("Failed to delete product");
//         onDelete(id);
//       } catch (error) {
//         console.error("Error deleting product:", error);
//         alert("Failed to delete product. Please try again.");
//       }
//     }
//   };

//   return (
//     <div className="card p-6 animate__fadeIn" role="region" aria-label="Product List">
//       <ul className="space-y-4">
//         {products.length > 0 ? (
//           products.map((product) => (
//             <li
//               key={product.id}
//               className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp"
//               role="listitem"
//             >
//               <span className="text-gray-800">
//                 {product.name} - ${product.price.toFixed(2)} (Inventory: {product.inventory})
//               </span>
//               <div className="flex space-x-2">
//                 <button
//                   onClick={() => onEdit(product)}
//                   className="bg-yellow-500 text-white px-3 py-1 rounded-lg hover:bg-yellow-600 transition-all focus:outline-none focus:ring-2 focus:ring-yellow-500"
//                   aria-label={`Edit ${product.name}`}
//                 >
//                   Edit
//                 </button>
//                 <button
//                   onClick={() => handleDelete(product.id)}
//                   className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all focus:outline-none focus:ring-2 focus:ring-red-500"
//                   aria-label={`Delete ${product.name}`}
//                 >
//                   Delete
//                 </button>
//               </div>
//             </li>
//           ))
//         ) : (
//           <li className="text-gray-500">No products available.</li>
//         )}
//       </ul>
//     </div>
//   );
// }