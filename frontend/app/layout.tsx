import "./globals.css";
import Navbar from "../components/Navbar";
import Providers from "./providers";

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
        </Providers>
      </body>
    </html>
  );
}