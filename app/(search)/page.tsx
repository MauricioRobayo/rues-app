import { Search } from "@/app/(search)/components/search";
import { Suspense } from "react";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import Providers from "@/app/(search)/providers";

export default function Page() {
  return (
    <Suspense>
      <Providers>
        <Search />
        <ReactQueryDevtools initialIsOpen />
      </Providers>
    </Suspense>
  );
}
