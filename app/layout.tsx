import type { Metadata } from "next";
import "./globals.css";
import { financierDisplay, calibre } from "./fonts";
import { Toaster } from "@/src/components/ui/sonner";

export const metadata: Metadata = {
  title: "PPT Theme Builder",
  description: "Create and customize PowerPoint templates with CBRE styling",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body
        className={`${financierDisplay.variable} ${calibre.variable} antialiased`}
      >
        {children}
        <Toaster />
        <div id="dropdown-portal-container" style={{ position: 'fixed', zIndex: 9999 }}></div>
      </body>
    </html>
  );
}
