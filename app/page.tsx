import { Button, Container, Flex } from "@chakra-ui/react";
import { POSTS_QUERY } from "./graphql/posts.query.";
import Link from "next/link";
import { Metadata } from "next";
import { IconMessageCircle } from "@tabler/icons-react";
import { createUrqlClient } from "./lib/urql-server";
import PostItem from "./components/PostItem";

export const metadata: Metadata = {
  title: "MyPosts",
  description: "MyPosts is a place to share your thoughts and ideas.",
};

export default async function Home() {
  const { client }: any = await createUrqlClient();
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
            <IconMessageCircle size={20} stroke={2} />
            Share Your Thoughts
          </Button>
        </Link>

        {posts.data?.posts.map((post: any) => (
          <PostItem key={post.id} post={post} />
        ))}
      </Container>
    </Flex>
  );
}
