import { Box, Container, Flex } from "@chakra-ui/react";
import CreatePostForm from "./CreatePostForm";
import { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Create Post - MyPosts",
  description: "Create a post to share your thoughts and ideas",
};

export default async function CreatePost() {
  const sessionCookie = (await cookies()).get("session_id")?.value;

  if (!sessionCookie) {
    redirect("/login?next=%2Fposts%2Fcreate");
  }

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
          <CreatePostForm />
        </Box>
      </Container>
    </Flex>
  );
}
