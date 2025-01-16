import Search from "@/app/(search)/components/search";
import { Suspense } from "react";

export default function Page() {
  return (
    <Suspense>
      <Search />
    </Suspense>
  );
}
