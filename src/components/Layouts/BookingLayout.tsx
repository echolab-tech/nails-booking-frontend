"use client";
import React from "react";
import Header from "../Header";

export default function BookingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Header sidebarOpen={false} setSidebarOpen={() => {}} />
      <div className="flex mt-[100px] min-h-screen max-w-screen-xl mx-auto bg-cover bg-center bg-fixed bg-cover">
        {children}
      </div>
    </>
  );
}
