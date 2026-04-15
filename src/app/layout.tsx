import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Resulta Analytics - Academic Results Analysis & Prediction System",
  description: "Resulta Analytics is a comprehensive academic results analysis and prediction system for schools.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}