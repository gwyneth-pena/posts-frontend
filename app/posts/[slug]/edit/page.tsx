import { Box, Container, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import EditPostForm from "./EditPostForm";

export const metadata: Metadata = {
  title: "Edit Post - MyPosts",
  description: "Edit your post",
};

export default async function EditPost({ params }: any) {
  const data = await params;
  const slug = data?.slug ?? null;

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
          <EditPostForm slug={slug} />
        </Box>
      </Container>
    </Flex>
  );
}
