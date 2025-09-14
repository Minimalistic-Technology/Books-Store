import React from "react";
import { Content } from "../../order-product-management/types";
import Image from "next/image";


interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (id: string, categoryPath: string) => void;
}

const ContentList: React.FC<ContentListProps> = ({ contents, onEdit, onDelete }) => {
  const defaultImageUrl = "https://images.pexels.com/photos/373465/pexels-photo-373465.jpeg";

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Category Path</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Tags</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Author</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Publisher</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Price</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Condition</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">New Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Discount New (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Old Quantity</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Discount Old (%)</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Estimated Delivery</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">SEO Title</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">SEO Description</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="px-2 py-2 whitespace-nowrap">
                  <Image
                  width={100}
                  height={100}
                    src={content.imageUrl || defaultImageUrl}
                    alt={content.title}
                    className="h-24 w-24 object-cover rounded"
                    onError={(e) => {
                      e.currentTarget.src = defaultImageUrl;
                    }}
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.title}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.categoryPath}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.tags}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.author}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.publisher}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">₹{content.price.toFixed(2)}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.condition}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.quantityNew}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.discountNew}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.quantityOld}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.discountOld}%</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.estimatedDelivery}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{content.description.substring(0, 50)}...</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{content.seoTitle}</td>
                <td className="px-6 py-4 text-sm text-gray-900">{content.seoDescription ? content.seoDescription.substring(0, 50) + "..." : ""}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(content)}
                    className="text-teal-600 hover:text-teal-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(content.id!, content.categoryPath)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ContentList;