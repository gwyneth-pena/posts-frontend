import { Button, Container, Flex } from "@chakra-ui/react";
import { POSTS_QUERY } from "./graphql/posts.query.";
import Link from "next/link";
import { Metadata } from "next";
import { IconMessageCircle } from "@tabler/icons-react";
import { createUrqlClient } from "./lib/urql-server";
import PostItem from "./components/PostItem";
import { USER_ME_QUERY } from "./graphql/users.query";
import PaginationWrapped from "./components/PaginationWrapped";

export const metadata: Metadata = {
  title: "MyPosts",
  description: "MyPosts is a place to share your thoughts and ideas.",
};

export default async function Home({ searchParams }: any) {
  const params = await searchParams;
  const currentPage = parseInt(params?.page || "1", 10);
  const limit = 10;
  const offset = (currentPage - 1) * limit;

  const { client }: any = await createUrqlClient();
  const posts = await client
    .query(
      POSTS_QUERY,
      {
        limit,
        offset,
      },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const user = await client
    .query(
      USER_ME_QUERY,
      {
        limit,
        offset,
      },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const totalPosts = posts.data?.totalPosts || 0;
  const totalPages = Math.ceil(totalPosts / limit);

  return (
    <>
      <Flex minH="80vh" bg="gray.100" flexDirection={"column"}>
        <Container maxW="100%" bg="gray.100" centerContent py={10} px={8}>
          <Link className="ms-auto mb-4" href="/posts/create">
            <Button bg="reddit.500" color="white" rounded="md" ms="auto">
              <IconMessageCircle size={20} stroke={2} />
              Share Your Thoughts
            </Button>
          </Link>

          {posts.data?.posts.map((post: any) => (
            <PostItem
              user={user?.data?.userMe}
              key={post.id}
              post={post}
              fromPage={currentPage}
            />
          ))}
        </Container>
        <Flex justifyContent={"center"} my={10}>
          <PaginationWrapped totalPages={totalPages} />
        </Flex>
      </Flex>
    </>
  );
}
