"use client";

import {
  Box,
  Container,
  Stack,
  Text,
  Link,
  HStack,
  IconButton,
} from "@chakra-ui/react";
import { FaGithub } from "react-icons/fa";

export default function Footer() {
  return (
    <Box bg="white" borderTop="1px solid" borderColor="gray.200">
      <Container maxW="7xl" py={4}>
        <Stack
          direction={{ base: "column", md: "row" }}
          padding={{ base: 3, md: 6 }}
          justify="space-between"
          align="center"
        >
          {/* Brand */}
          <Text fontWeight="bold" color="gray.700">
            MyPosts © {new Date().getFullYear()}
          </Text>

          {/* Navigation Links */}
          <HStack padding={6}>
            <Link href="/about" color="gray.600" _hover={{ color: "blue.500" }}>
              About
            </Link>
            <Link
              href="/contact"
              color="gray.600"
              _hover={{ color: "blue.500" }}
            >
              Contact
            </Link>
            <Link
              href="/privacy"
              color="gray.600"
              _hover={{ color: "blue.500" }}
            >
              Privacy
            </Link>
          </HStack>

          {/* Social Media */}
          <HStack padding={2}>
            <Link href="https://github.com">
              <IconButton aria-label="GitHub" variant="ghost">
                <FaGithub />
              </IconButton>
            </Link>
          </HStack>
        </Stack>
      </Container>
    </Box>
  );
}
