"use client";
import { useState } from "react";
import Head from "next/head";
import { navigate } from "./actions";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  const [searchQuery, setSearchQuery] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim() === "") {
      setError("Please enter a search query.");
      return;
    }

    const encodedQuery = encodeURIComponent(searchQuery);
    router.push(`/search/?query=${encodedQuery}`);
  };

  return (
    <>
      <Head>
        <title>Poshmark Search</title>
        <meta
          name="description"
          content="Search and select items from Poshmark"
        />
      </Head>
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold mb-2">
            Search sold items on Poshmark.
          </h1>
          <p className="text-gray-600">
            Make your search as specific as possible.
          </p>
        </div>
        <form
          className="flex flex-col sm:flex-row items-center w-full max-w-md"
          onSubmit={handleSubmit}
        >
          <input
            type="text"
            name="query"
            id="query"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Free People Adella Maxi Dress"
            aria-label="Search sold items"
            className="w-full text-black sm:w-auto flex-grow px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4 sm:mb-0 sm:mr-4"
          />
          <button
            type="submit"
            className="w-full sm:w-auto px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            Search
          </button>
        </form>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </main>
    </>
  );
}
