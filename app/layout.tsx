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
      <body className="flex h-screen overflow-hidden">
        <div className="flex flex-col w-full h-full overflow-hidden">
          {children}
        </div>
      </body>
    </html>
  );
}