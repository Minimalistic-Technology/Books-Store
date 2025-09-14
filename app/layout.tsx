import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Books Store",
  description: "Admin panel for Books Store",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex h-screen w-full overflow bg-gray-50">
        <div className="flex flex-col w-full h-full overflow">
          
          {children}
          
        </div>
      </body>
    </html>
  );
}
