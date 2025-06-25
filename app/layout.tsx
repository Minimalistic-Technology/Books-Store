import "./globals.css";

export const metadata = {
  title: "Minimalistic Book Center",
  description: "A minimalistic platform for book lovers",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
