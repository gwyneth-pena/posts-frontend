"use client";

import { ButtonGroup, IconButton, Button } from "@chakra-ui/react";
import { HiChevronLeft, HiChevronRight } from "react-icons/hi";

interface PaginationProps {
  totalPages: number;
  currentPage: number;
  onPageChange: (page: number) => void;
}

export default function PaginationGlobal({
  totalPages,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const delta = 2;

  const getVisiblePages = () => {
    const pages: (number | string)[] = [];

    pages.push(1);

    if (currentPage - delta > 2) pages.push("...");

    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      pages.push(i);
    }

    if (currentPage + delta < totalPages - 1) pages.push("...");

    if (totalPages > 1) pages.push(totalPages);

    return pages.filter(
      (page, index, arr) => !(page === "..." && arr[index - 1] === "...")
    );
  };

  const pagesToDisplay = getVisiblePages();

  return (
    <ButtonGroup attached variant="outline" size="sm">
      <IconButton
        aria-label="Previous page"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <HiChevronLeft />
      </IconButton>

      {pagesToDisplay.map((page, index) =>
        page === "..." ? (
          <Button key={`dots-${index}`} cursor="default" pointerEvents="none">
            ...
          </Button>
        ) : (
          <Button
            key={page}
            bg={currentPage === page ? "reddit.500" : "white"}
            color={currentPage === page ? "white" : "black"}
            border="1px solid"
            borderColor="gray.300"
            _hover={{
              bg: currentPage === page ? "reddit.600" : "gray.100",
            }}
            onClick={() => onPageChange(Number(page))}
          >
            {page}
          </Button>
        )
      )}

      <IconButton
        aria-label="Next page"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <HiChevronRight />
      </IconButton>
    </ButtonGroup>
  );
}
