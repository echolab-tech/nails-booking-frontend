"use client";
import React from "react";

export default function NoneSideBarLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* <!-- ===== Page Wrapper Start ===== --> */}
      <div className="flex h-screen items-center justify-center overflow-hidden">
        <main>
          <div className="mx-auto max-w-screen-2xl p-4 md:p-6 2xl:p-10">
            {children}
          </div>
        </main>
      </div>
      {/* <!-- ===== Page Wrapper End ===== --> */}
    </>
  );
}
