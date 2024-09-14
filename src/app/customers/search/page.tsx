"use client";

import React, { useState } from "react";


interface SearchProps {
  handleSearch: (birthday: string, searchText: string) => void;
  handleInputChange: (value: string) => void;
}


const Search: React.FC<SearchProps> = ({ handleSearch, handleInputChange }) => {
  const [birthday, setBirthday] = useState<string>("");
  const [searchText, setSearchText] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(birthday, searchText);
  };
  
  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchText(value); // Cập nhật state trong component con
    handleInputChange(value); // Gọi hàm từ lớp cha để truyền dữ liệu lên, không truyền sự kiện mà là giá trị
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="flex w-full items-center space-x-4"
    >
      <div className="flex-1">
        <input
          type="text"
          id="searchText"
          value={searchText}
          onChange={handleTextChange}
          placeholder="Search by name, email or mobile number"
          className="text-gray-700 focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
        />
      </div>
      <div className="flex-3">
        <input
          type="date"
          id="birthday"
          value={birthday}
          onChange={(e) => setBirthday(e.target.value)}
          className="text-gray-700 focus:shadow-outline w-full appearance-none rounded border px-3 py-2 leading-tight shadow focus:outline-none"
        />
      </div>
      <button
        type="submit"
        className="focus:shadow-outline rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700 focus:outline-none"
      >
        Search
      </button>
    </form>
  );
};

export default Search;
