import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <header className="bg-primary text-white">
          <div className="max-w-7xl mx-auto flex justify-between items-center p-4">
            <h1 className="text-2xl font-bold">Document Rename Agent</h1>
            <div className="space-x-4">
              <a href="/login" className="hover:underline">
                Login
              </a>
              <a
                href="/signup"
                className="bg-white text-primary px-4 py-2 rounded hover:bg-gray-200"
              >
                Sign Up
              </a>
            </div>
          </div>
        </header>
        <div className="bg-black text-white text-center py-2">
          Free users: up to 5 uploads per day.{" "}
          <a
            href="/signup"
            className="underline font-semibold"
          >
            Upgrade for unlimited uploads
          </a>
        </div>
        <main className="min-h-screen bg-background">{children}</main>
        <footer className="bg-gray-100 text-gray-600 text-center p-4">
          © 2025 Document Rename Agent. Need help?{" "}
          <a
            href="mailto:support@rename-agent.com"
            className="underline"
          >
            Contact support
          </a>
        </footer>
      </body>
    </html>
  );
}
