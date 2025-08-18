"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const SearchProduct = () => {
  const [search, setSearch] = useState("");
  const router = useRouter();

  const handleSearch = () => {
    if (search.trim()) {
      router.push(`/search?query=${encodeURIComponent(search)}`);
      setSearch(""); // Clear the search input after navigating
    }
  };

  const handKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <input
      type="text"
      placeholder="Tìm kiếm..."
      className="w-[100%] border-2 rounded-xl text-white outline-none py-1 px-3 "
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      onKeyDown={handKeyDown}
    />
  );
};
export default SearchProduct;
