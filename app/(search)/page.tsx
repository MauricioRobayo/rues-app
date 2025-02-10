import { SearchName } from "@/app/(search)/components/SearchName";
import { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "@/app/(search)/providers";

export default function Page() {
  return (
    <Suspense>
      <Providers>
        <SearchName />
        <ReactQueryDevtools initialIsOpen />
      </Providers>
    </Suspense>
  );
}
