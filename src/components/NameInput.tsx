"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NameInput() {
  const [name, setName] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) return;

    // URL-safe 인코딩
    router.push(`/result/${encodeURIComponent(trimmed.toLowerCase())}`);
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="relative">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value.replace(/[^a-zA-Z\s'-]/g, ""))}
          placeholder="Enter your name (e.g. James)"
          className="w-full px-6 py-4 text-xl rounded-2xl border-2 border-gray-200
                     focus:border-rose-400 focus:outline-none focus:ring-2 focus:ring-rose-100
                     placeholder:text-gray-300 text-gray-800 bg-white
                     transition-all duration-200"
          maxLength={30}
          autoFocus
          autoComplete="off"
        />
      </div>
      <button
        type="submit"
        disabled={!name.trim()}
        className="w-full mt-4 px-6 py-4 text-xl font-bold rounded-2xl
                   bg-gradient-to-r from-rose-500 to-pink-500 text-white
                   hover:from-rose-600 hover:to-pink-600
                   disabled:from-gray-300 disabled:to-gray-300 disabled:cursor-not-allowed
                   transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
      >
        Get My Korean Name ✨
      </button>
    </form>
  );
}
