import type { Metadata } from "next";
import { Poppins, Inter } from "next/font/google";
import { Toaster } from 'react-hot-toast';
import "./globals.css";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-poppins',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: "Learn What Matters",
  description: "Your modern learning platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full">
      {/* - flex and flex-col make the body a vertical flex container.
        - min-h-full ensures it takes up at least the full screen height.
      */}
      <body className={`${poppins.variable} ${inter.variable} font-body bg-gray-900 text-white flex flex-col min-h-full`}>
        <AuthProvider>
          <Toaster position="bottom-center" />
          <Navbar />
          {/* - flex-grow allows this main section to expand and fill any
              available space, pushing the footer down.
          */}
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
