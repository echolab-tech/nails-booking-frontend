"use client";

import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

interface SearchType {
  placeholder: string;
  handleSearch: (value: string) => void;
}

export default function Search({ placeholder, handleSearch }: SearchType) {
  return (
    <div className="relative flex">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="placeholder:text-gray-500 peer block w-64 rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2"
        placeholder={placeholder}
        onChange={(e) => {
          handleSearch(e.target.value);
        }}
      />

      <MagnifyingGlassIcon className="text-gray-500 absolute left-3 top-1/2 h-[20px] w-[20px] -translate-y-1/2 peer-focus:text-gray-900" />
    </div>
  );
}
