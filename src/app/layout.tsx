import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { SearchBar } from "@/components/layout/SearchBar";
import { NotificationsDropdown } from "@/components/layout/Notifications";
import { LayoutDashboard, Compass, MessageCircle, BarChart3, ShieldCheck } from "lucide-react";
import Link from "next/link";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { PWARegistration } from "@/components/providers/PWARegistration";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Valen | Forecast the Future",
  description: "A social network for predictions and credibility.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#050505" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-slate-950 text-slate-200`}>
        <AuthProvider>
          <PWARegistration />
          <div className="flex min-h-screen flex-col">
            <nav className="sticky top-0 z-50 w-full border-b border-white/5 bg-slate-950/80 backdrop-blur-xl">
              <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-8">
                <Link href="/" className="flex items-center space-x-2 shrink-0">
                  <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
                    <span className="font-black text-white text-lg italic">V</span>
                  </div>
                  <span className="text-xl font-black text-white tracking-tighter uppercase">Valen</span>
                </Link>

                <div className="flex-1 hidden md:flex justify-center">
                  <SearchBar />
                </div>

                <div className="flex items-center space-x-2">
                  <NotificationsDropdown />
                  <Link href="/messages" className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-all">
                    <MessageCircle className="w-6 h-6" />
                  </Link>
                  <div className="w-8 h-8 rounded-full bg-slate-800 border border-white/10 ml-2" />
                </div>
              </div>
            </nav>

            <div className="flex-1 flex max-w-7xl mx-auto w-full">
              <aside className="hidden lg:flex w-64 flex-col fixed h-[calc(100vh-64px)] py-8 pr-8 border-r border-white/5">
                <div className="space-y-1">
                  {[
                    { name: "Feed", icon: LayoutDashboard, href: "/" },
                    { name: "Explore", icon: Compass, href: "/communities" },
                    { name: "Analytics", icon: BarChart3, href: "/analytics" },
                    { name: "Messages", icon: MessageCircle, href: "/messages" },
                    { name: "Admin", icon: ShieldCheck, href: "/admin" },
                  ].map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      className="flex items-center space-x-3 px-4 py-3 rounded-2xl text-slate-400 hover:text-white hover:bg-white/5 transition-all group"
                    >
                      <item.icon className="w-5 h-5 group-hover:text-blue-500 transition-colors" />
                      <span className="font-bold text-sm tracking-tight">{item.name}</span>
                    </Link>
                  ))}
                </div>

                <div className="mt-auto p-6 rounded-3xl bg-gradient-to-br from-blue-600/10 to-purple-600/10 border border-white/5">
                  <h4 className="text-xs font-black text-blue-500 uppercase tracking-widest mb-2">Valen Status</h4>
                  <p className="text-[11px] text-slate-400 leading-relaxed font-medium">Credibility-backed forecasting network active.</p>
                </div>
              </aside>

              <main className="flex-1 lg:ml-64 w-full">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
