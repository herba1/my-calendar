import { Geist, Geist_Mono, DM_Sans } from "next/font/google";
import "./globals.css";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const dmSans = DM_Sans({
  weight: ["variable"],
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "essence",
  description:
    "Quickly speak your mind and dump your thoughts on your plans, tasks and schedule. We will sort it out for you, with a nice and minimalist ui.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${dmSans.className} antialiased`}
      >
        <Analytics />
        {children}
      </body>
    </html>
  );
}
