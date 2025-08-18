// "use client";

// import { useState, useEffect } from "react";
// import type { Category } from "../page";
// import { API_BASE_URL } from '../../../../utils/api';

// type CategoryTagListProps = {
//   onEdit: (item: Category) => void;
//   onDelete: (id: string) => void;
//   items: Category[];
// };

// export default function CategoryTagList({ onEdit, onDelete, items }: CategoryTagListProps) {
//   const handleDelete = async (id: string) => {
//     try {
//       const response = await fetch(`${API_BASE_URL}/book-categories/${id}`, {
//         method: "DELETE",
//       });
//       if (!response.ok) throw new Error("Failed to delete category/tag");
//       onDelete(id);
//     } catch (error) {
//       console.error("Error deleting category/tag:", error);
//     }
//   };

//   return (
//     <div className="card p-6 animate__fadeIn">
//       <h2 className="text-2xl font-semibold mb-4 text-yellow-900">Categories & Tags List</h2>
//       <ul className="space-y-4">
//         {items.map((item) => (
//           <li key={item.id} className="border p-4 rounded-lg bg-white shadow-md flex justify-between items-center animate__fadeInUp">
//             <span className="text-gray-800">
//               {item.name} ({item.type})
//             </span>
//             <div>
//               <button
//                 onClick={() => onEdit(item)}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded-lg mr-2 hover:bg-yellow-600 transition-all"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(item.id)}
//                 className="bg-red-500 text-white px-3 py-1 rounded-lg hover:bg-red-600 transition-all"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }