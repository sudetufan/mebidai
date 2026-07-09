import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { Toaster } from "sonner";
import Footer from "../components/Footer";

export const metadata = {
  title: "MEBIDAI Community",
  description: "Build. Share. Learn.",
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

        </Providers>

      </body>
    </html>
  );
}