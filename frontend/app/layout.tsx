import "./globals.css";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Providers from "./providers";

import { Toaster } from "sonner";

export const metadata = {
  title: {
    default: "MEBIDAI Community",
    template: "%s | MEBIDAI",
  },

  description:
    "MEBIDAI is a community platform where users share knowledge, articles and ideas.",

  keywords: [
    "MEBIDAI",
    "community",
    "blog",
    "technology",
    "knowledge sharing",
  ],

  authors: [
    {
      name: "MEBIDAI Team",
    },
  ],

  openGraph: {
    title: "MEBIDAI Community",
    description:
      "Build. Share. Learn. A platform for knowledge sharing.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <Providers>

          <Navbar />

          <main className="flex-1">
            {children}
          </main>

          <Footer />

          <Toaster
            position="bottom-right"
            duration={3000}
          />

        </Providers>
      </body>
    </html>
  );
}