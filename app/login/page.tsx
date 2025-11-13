import { Container, Box, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Login - MyPosts",
  description: "Login to your account and start contributing",
};

export default async function Login({ searchParams }: any) {
  const params = (await searchParams) ?? null;
  const next = params?.next ?? null;
  return (
    <Flex
      minH={"80vh"}
      bg="gray.100"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Container maxW="100%" bg="gray.100" centerContent py={10} px={4}>
        <Box
          w={["100%", "90%", "600px"]}
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="md"
        >
          <LoginForm next={next} />
        </Box>
      </Container>
    </Flex>
  );
}
