"use client";

import { useSearchParams, useRouter } from "next/navigation";
import PaginationGlobal from "./Pagination";
import { useEffect } from "react";

interface Props {
  totalPages: number;
}

export default function PaginationWrapped({ totalPages }: Props) {
  const searchParams = useSearchParams();
  const router = useRouter();

  let currentPage = parseInt(searchParams.get("page") || "1", 10);

  const handlePageChange = (page: number) => {
    router.push(`/?page=${page}`);
  };

  useEffect(() => {
    if (currentPage < 1) {
      currentPage = 1;
    }
    if (currentPage > totalPages) {
      currentPage = totalPages;
    }
    router.push(`/?page=${currentPage}`);
  }, []);

  return (
    <PaginationGlobal
      currentPage={currentPage}
      totalPages={totalPages}
      onPageChange={handlePageChange}
    />
  );
}
