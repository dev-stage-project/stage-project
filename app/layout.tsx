import type { Metadata } from "next";
import "./globals.css";
import Header from "@/app/components/shared/header";
import Footer from "@/app/components/shared/footer";
import { AuthProvider } from "./hooks/useAuth";

export const metadata: Metadata = {
  title: "ReVentures",
  description: "Give your old stuff a new life",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
return (
    <html lang="en">
        <body className="antialiased min-h-screen flex flex-col bg-slate-50">
          <AuthProvider>
            <Header />
            <main className="flex-1 w-full md:w-4/5 self-center pt-12 mt-2 px-4 py-2">
                {children}
            </main>
            <Footer />
            </AuthProvider>
        </body>
    </html>
);
}
