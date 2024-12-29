"use client";

import { getCompany } from "@/app/server-functions";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export function SearchResults() {
  const searchParams = useSearchParams();
  const [results, setResults] = useState();
  const query = searchParams.get("q");

  useEffect(() => {
    async function search() {
      if (!query) {
        return;
      }
      const response = await getCompany(query);
      console.log("response", response);
      // setResults(response);
    }

    search();
  }, [query]);

  return (
    <div>
      <h1>Search results for {query}</h1>
    </div>
  );
}
