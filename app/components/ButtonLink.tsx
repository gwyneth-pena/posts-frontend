"use client";

import { chakra } from "@chakra-ui/react";
import type { ReactNode } from "react";

interface ButtonLinkProps {
  children: ReactNode;
  href: string;
}

export default function ButtonLink({ children, href }: ButtonLinkProps) {
  return (
    <chakra.a
      href={href}
      display="inline-flex"
      alignItems="center"
      justifyContent="center"
      bg="reddit.500"
      color="white"
      px={4}
      py={2}
      borderRadius="md"
      textDecoration="none"
      _hover={{ bg: "reddit.600" }}
    >
      {children}
    </chakra.a>
  );
}
