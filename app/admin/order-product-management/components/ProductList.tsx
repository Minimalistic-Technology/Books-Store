"use client";

import type { Product } from "../page";

type ProductListProps = {
  products: Product[];
  onEdit: (product: Product) => void;
  onDelete: (id: string) => void;
};

export default function ProductList({ products, onEdit, onDelete }: ProductListProps) {
  return (
    <div className="bg-blue-200 p-4 rounded-lg shadow">
      <ul className="space-y-2">
        {products.map((product) => (
          <li key={product.id} className="border-b py-2 flex justify-between items-center">
            <span>
              {product.name} - ${product.price.toFixed(2)} (Inventory: {product.inventory})
            </span>
            <div>
              <button
                onClick={() => onEdit(product)}
                className="bg-yellow-500 text-white px-2 py-1 rounded mr-2 hover:bg-yellow-600"
              >
                Edit
              </button>
              <button
                onClick={() => onDelete(product.id)}
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}