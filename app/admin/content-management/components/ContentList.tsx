import React from "react";

interface Content {
  id?: string;
  title: string;
  categoryName: string;
  subCategory: string;
  tags: string;
  seoTitle: string;
  seoDescription: string;
  price: number;
  description: string;
  estimatedDelivery: string;
  condition: string;
  author: string;
  publisher: string;
  imageUrl: string;
  quantityNew: number;
  quantityOld: number;
  discountNew: number;
  discountOld: number;
  bookName?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface ContentListProps {
  contents: Content[];
  onEdit: (content: Content) => void;
  onDelete: (id: string, categoryName: string) => void;
}

const ContentList: React.FC<ContentListProps> = ({
  contents,
  onEdit,
  onDelete,
}) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Subcategory
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Price
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Condition
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                New Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Old Quantity
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                New Discount (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Old Discount (%)
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Author
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-black uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {contents.map((content) => (
              <tr key={content.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.imageUrl ? (
                    <img
                      src={content.imageUrl}
                      alt={content.title || "Book Image"}
                      className="w-12 h-16 object-cover rounded-md"
                      onError={(e) => {
                        (e.currentTarget as HTMLElement).style.display = "none";
                        const nextSibling = e.currentTarget
                          .nextElementSibling as HTMLElement;
                        if (nextSibling) {
                          nextSibling.style.display = "flex";
                        }
                      }}
                    />
                  ) : null}
                  <div
                    className="w-12 h-16 flex items-center justify-center bg-gray-100 rounded-md text-gray-500 text-xs"
                    style={{ display: content.imageUrl ? "none" : "flex" }}
                  >
                    No image
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {content.title}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.categoryName}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.subCategory}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.price.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.condition}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.quantityNew}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.quantityOld}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.discountNew}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.discountOld}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-black">
                  {content.author}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button
                    onClick={() => onEdit(content)}
                    className="text-teal-600 hover:text-teal-900 mr-4"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() =>
                      content.id && onDelete(content.id, content.categoryName)
                    }
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
