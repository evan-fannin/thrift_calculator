"use client";

import { useSearchParams } from "next/navigation";

export default function Summary() {
  const params = useSearchParams();
  const items = params.getAll("items");

  return (
    <>
      <main className="min-h-screen bg-gray-50 py-8">
        <div className="container mx-auto px-4">
          {items.map((item, i) => (
            <>
              <div>{JSON.parse(item).price}</div>
              <div>{JSON.parse(item).imageUrl}</div>
            </>
          ))}
        </div>
      </main>
    </>
  );
}
