"use client";
import "jsvectormap/dist/css/jsvectormap.css";
import "flatpickr/dist/flatpickr.min.css";
import "@/css/satoshi.css";
import "@/css/style.css";
import React, { useEffect, useState, useContext, createContext } from "react";
import Loader from "@/components/common/Loader";
import { ToastProvider } from "@/providers/ToastProvider";
import "react-toastify/dist/ReactToastify.css";
import { AuthProvider } from "@/providers/AuthProvider";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  //const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState<boolean>(true);

  // const pathname = usePathname();

  useEffect(() => {
    setTimeout(() => setLoading(false), 1000);
  }, []);

  return (
    <html lang="en">
      <body suppressHydrationWarning={true}>
        <div className="dark:bg-boxdark-2 dark:text-bodydark">
          {loading ? <Loader /> : <AuthProvider>{children}</AuthProvider>}
        </div>
      </body>
    </html>
  );
}
