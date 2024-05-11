"use client";

import { Pagination } from "flowbite-react";
import { useState } from "react";

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}
export function PaginationCustom(props: PaginationProps) {
    const { currentPage, totalPages, onPageChange } = props;

  return (
    <div className="flex overflow-x-auto sm:justify-center">
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  );
}
export default PaginationCustom;