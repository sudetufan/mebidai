import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "./providers";
import { Toaster } from "sonner";

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
      <body>
        <Providers>
          <Navbar />
          {children}
          <Toaster
            position="top-right"
            richColors
            closeButton
            duration={2500}
          />
        </Providers>
      </body>
    </html>
  );
}