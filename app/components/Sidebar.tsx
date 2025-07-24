// components/Sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
  const pathname = usePathname();

  const isActive = (path: string) => pathname === path;

  return (
    <aside className="w-64 bg-yellow-100 shadow-lg rounded-r-lg h-screen overflow-y-auto transition-all duration-300 animate__slideInLeft">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold mb-6 bg-gradient-to-r from-yellow-400 to-yellow-600 bg-clip-text text-transparent">
          Admin Panel
        </h2>
        <nav>
          <ul className="space-y-2">
            <li>
              <Link
                href="/admin/dashboard"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/dashboard")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/content-management"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/content-management")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Content Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories-tags"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/categories-tags")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Categories & Tags
              </Link>
            </li>
            <li>
              <Link
                href="/admin/comments-reviews"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/comments-reviews")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Comments & Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/admin/order-product-management"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/order-product-management")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Order & Product Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/site-settings"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/site-settings")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Site Settings
              </Link>
            </li>
            <li>
              <Link
                href="/admin/order-management"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/order-management")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Order Management
              </Link>
            </li>
            {/* <li>
              <Link
                href="/admin/notifications"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/notifications")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Banners
              </Link>
            </li> */}
            <li>
              <Link
                href="/admin/notifications-email"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/notifications-email")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Notifications & Email Management
              </Link>
            </li>
            
            <li>
              <Link
                href="/admin/import-export"
                className={`block p-3 text-gray-800 rounded-lg transition-all duration-200 font-medium ${
                  isActive("/admin/import-export")
                    ? "bg-yellow-200 text-yellow-900 shadow-md"
                    : "hover:bg-yellow-200 hover:shadow-md animate__pulse"
                }`}
              >
                Import/Export
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}