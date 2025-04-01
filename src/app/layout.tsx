import type { Metadata } from "next";
import "./globals.css";
import Footer from "@/components/Footer";
import Script from "next/script";


export const metadata: Metadata = {
  title: "Derrick Maurais",
  description: "Portfolio Website",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {

  return (
    <html lang="en">
      <body className="bg-gray-900 min-h-screen font-poppins m-0 text-ash_gray-900">
        <div className="flex-1 overflow-auto">
          {children}
          <div className="bg-ash_gray opacity-25 lg:absolute lg:bottom-3 lg:left-0 lg:mb-0 ">
            <Footer />
          </div>
          {/* script for using emailjs */}
          <Script src="https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js"></Script>
        </div>
      </body>
    </html>
  );
}
