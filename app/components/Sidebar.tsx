"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-64 bg-yellow-100 shadow-lg rounded-r-lg h-screen overflow-y-auto transition-all duration-300">
      <div className="p-6">
        <h2 className="text-2xl font-extrabold mb-6  from-yellow-400 to-yellow-600 bg-clip-text text-black">
          Admin Panel
        </h2>
        <nav>
          <ul className="space-y-3">
            <li>
              <Link
                href="/admin/dashboard"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                href="/admin/content-management"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Content Management
              </Link>
            </li>
            <li>
              <Link
                href="/admin/categories-tags"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Categories & Tags
              </Link>
            </li>
            <li>
              <Link
                href="/admin/comments-reviews"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Comments & Reviews
              </Link>
            </li>
            <li>
              <Link
                href="/admin/order-product-management"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Order & Product Management
              </Link>
            </li>
            <li>
              <a
                href="/admin/site-settings"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Site Settings
              </a>
            </li>
            <li>
              <a
                href="/admin/order-management"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Order Management
              </a>
            </li>
            <li>
              <a
                href="/admin/notifications"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Banners
              </a>
            </li>
            <li>
              <a
                href="/admin/notifications-email"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Notifications & Email Management
              </a>
            </li>
            <li>
              <a
                href="/admin/logs-audit"
                className="block p-3 text-black hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Logs & Audit Trail
              </a>
            </li>
            <li>
              <a
                href="/admin/import-export"
                className="block p-3 text-yellow-900 hover:bg-yellow-200 rounded-lg transition-colors duration-200 font-medium hover:shadow-md"
              >
                Import/Export
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </aside>
  );
}