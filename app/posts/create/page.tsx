import { Box, Container, Flex } from "@chakra-ui/react";
import CreatePostForm from "./CreatePostForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Post - MyPosts",
  description: "Create a post to share your thoughts and ideas",
};

export default async function CreatePost() {
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
          <CreatePostForm/>
        </Box>
      </Container>
    </Flex>
  );
}
