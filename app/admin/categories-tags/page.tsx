// "use client";

// import { useState, useEffect } from "react";
// import CategoryTagForm from "./components/CategoryTagForm";
// import CategoryTagList from "./components/CategoryTagList";
// import { API_BASE_URL } from '../../../utils/api';

// export interface Category {
//   id: string;
//   name: string;
//   seoTitle?: string; // Made optional
//   seoDescription?: string; // Made optional
//   type: string;
// }

// export default function CategoriesTags() {
//   const [items, setItems] = useState<Category[]>([]);
//   const [selectedItem, setSelectedItem] = useState<Category | null>(null);
//   const [isCreating, setIsCreating] = useState<boolean>(false);

//   useEffect(() => {
//     const fetchCategories = async () => {
//       try {
//         const response = await fetch(`${API_BASE_URL}/book-categories`);
//         const data = await response.json();
//         setItems(
//           data.map((item: any) => ({
//             id: item._id,
//             name: item.name,
//             seoTitle: item.seoTitle,
//             seoDescription: item.seoDescription,
//             type: "category",
//           }))
//         );
//       } catch (error) {
//         console.error("Failed to fetch categories:", error);
//       }
//     };

//     fetchCategories();
//   }, []);

//   const handleEdit = (item: Category) => {
//     setSelectedItem(item);
//     setIsCreating(true);
//   };

//   const handleCreate = () => {
//     setSelectedItem(null);
//     setIsCreating(true);
//   };

//   const handleDelete = (id: string) => {
//     setItems((prev) => prev.filter((item) => item.id !== id));
//   };

//   const handleSave = async (data: {
//     id?: string;
//     name: string;
//     seoTitle?: string; // Made optional
//     seoDescription?: string; // Made optional
//   }) => {
//     const newItem: Category = {
//       id: data.id || Date.now().toString(),
//       name: data.name,
//       seoTitle: data.seoTitle,
//       seoDescription: data.seoDescription,
//       type: "category",
//     };
//     try {
//       let response;
//       if (data.id) {
//         response = await fetch(`${API_BASE_URL}/book-categories/${data.id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: data.name,
//             seoTitle: data.seoTitle,
//             seoDescription: data.seoDescription,
//           }),
//         });
//       } else {
//         response = await fetch(`${API_BASE_URL}/book-categories`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({
//             name: data.name,
//             seoTitle: data.seoTitle,
//             seoDescription: data.seoDescription,
//           }),
//         });
//       }
//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || "Failed to save category");
//       }
//       const savedData = await response.json();
//       newItem.id = savedData._id || newItem.id;
//       if (selectedItem) {
//         setItems((prev) =>
//           prev.map((item) => (item.id === selectedItem.id ? newItem : item))
//         );
//       } else {
//         setItems((prev) => [...prev, newItem]);
//       }
//     } catch (error) {
//       console.error("Error saving category:", error);
//     }
//     setIsCreating(false);
//     setSelectedItem(null);
//   };

//   const handleClose = () => {
//     setIsCreating(false);
//     setSelectedItem(null);
//   };

//   return (
//     <div className="space-y-8 p-4 animate__fadeIn">
//       <h1 className="text-4xl font-bold text-yellow-900">Categories - Books Store</h1>
//       <div className="flex justify-end">
//         <button
//           onClick={handleCreate}
//           className="btn-primary px-4 py-2 rounded-lg hover:bg-teal-700 transition-all"
//         >
//           Create New Category
//         </button>
//       </div>
//       <CategoryTagList onEdit={handleEdit} onDelete={handleDelete} items={items} />
//       {isCreating && (
//         <div className="fixed inset-0 bg-yellow-50 bg-opacity-50 flex items-center justify-center z-50 animate__fadeIn">
//           <div className="card bg-white p-6 rounded-lg shadow-lg max-w-lg w-full relative animate__zoomIn">
//             <button
//               onClick={handleClose}
//               className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl font-bold"
//             >
//               ×
//             </button>
//             <CategoryTagForm
//               item={
//                 selectedItem
//                   ? {
//                       id: selectedItem.id,
//                       name: selectedItem.name,
//                       seoTitle: selectedItem.seoTitle,
//                       seoDescription: selectedItem.seoDescription,
//                     }
//                   : undefined
//               }
//               onClose={handleClose}
//               onSave={handleSave}
//             />
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }