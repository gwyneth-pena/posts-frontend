import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { POSTS_QUERY } from "./graphql/posts.query.";
import { createUrqlClient } from "./lib/urql-client";
import Link from "next/link";
import { Metadata } from "next";
import { IconFilePlus } from "@tabler/icons-react";
import { format } from "date-fns";
import PostMenu from "./components/PostMenu";

export const metadata: Metadata = {
  title: "MyPosts",
  description: "MyPosts is a place to share your thoughts and ideas.",
};

export default async function Home() {
  const { client }: any = createUrqlClient();
  const posts = await client
    .query(
      POSTS_QUERY,
      {},
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  return (
    <Flex minH="80vh" bg="gray.100" justifyContent="center">
      <Container maxW="100%" bg="gray.100" centerContent py={10} px={8}>
        <Link className="ms-auto mb-4" href="/posts/create">
          <Button bg="reddit.500" color="white" rounded="md" ms="auto">
            <IconFilePlus size={20} stroke={2} />
            &nbsp;Create Post
          </Button>
        </Link>

        {posts.data?.posts.map((post: any) => (
          <Box
            key={post.id}
            w={["100%", "90%", "600px"]}
            bg="white"
            p={6}
            mb={4}
            borderRadius="md"
            boxShadow="md"
          >
            <Flex justify="space-between" align="start" mb={2}>
              <h4 style={{ fontWeight: "600" }}>{post.title}</h4>
              <PostMenu id={post.id} />
            </Flex>

            <small className="text-muted">{post.user.username}</small>
            <p className="mt-3">{post.text}</p>
            <small className="text-muted">
              {format(new Date(Number(post.createdAt)), "PPP 'at' p")}
            </small>
          </Box>
        ))}
      </Container>
    </Flex>
  );
}
