import { POSTS_QUERY } from "@/app/graphql/posts.query.";
import { USER_QUERY } from "@/app/graphql/users.query";
import { createUrqlClient } from "@/app/lib/urql-server";
import { Box, Container, Flex, HStack, Link, Text } from "@chakra-ui/react";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: { username: string };
}): Promise<Metadata> {
  const parameters = await params;
  const { client } = await createUrqlClient();
  const res = await client
    .query(
      USER_QUERY,
      { username: parameters?.username },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const username = res.data?.user?.username ?? "User";
  return {
    title: `${username}'s Profile - MyPosts`,
    description: `View ${username}'s profile on MyPosts.`,
  };
}

export default async function Profile({
  params,
}: {
  params: { username: string };
}) {
  const parameters = await params;
  const { client } = await createUrqlClient();
  const userRes = await client
    .query(
      USER_QUERY,
      { username: parameters?.username },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const posts = await client
    .query(
      POSTS_QUERY,
      {
        username: parameters?.username,
        limit: 10,
        offset: 0,
      },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const likedPosts = await client
    .query(
      POSTS_QUERY,
      {
        likedByUsername: parameters?.username,
        limit: 10,
        offset: 0,
      },
      {
        requestPolicy: "cache-and-network",
      }
    )
    .toPromise();

  const user = userRes.data?.user;

  if (!user) {
    return (
      <Flex minH="80vh" align="center" justify="center" bg="gray.50">
        <Text color="gray.600" fontSize="lg">
          User not found.
        </Text>
      </Flex>
    );
  }

  return (
    <Flex minH="80vh" bg="gray.50" justify="center">
      <Container maxW="container.lg" py={10} px={4}>
        <Flex
          align={{ base: "center", md: "flex-start" }}
          direction={{ base: "column", md: "row" }}
          justify="space-between"
        >
          <HStack padding={4} align="flex-start">
            <Box textAlign={{ base: "center", md: "left" }}>
              <Text fontSize="2xl" fontWeight="bold">
                {user.username}
              </Text>
              <Text fontSize="sm" color="gray.500">
                {user.email ?? "No email provided"}
              </Text>
            </Box>
          </HStack>
        </Flex>

        <Flex
          gap={{ base: 4, md: 6 }}
          direction={{ base: "column", md: "row" }}
          align="stretch"
        >
          <Box
            bg="white"
            borderRadius="md"
            boxShadow="md"
            p={8}
            w={{ base: "100%", md: "60%" }}
          >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              Posts
            </Text>
            {posts.data?.posts?.length === 0 && (
              <Text color="gray.500">No posts yet.</Text>
            )}
            {posts.data?.posts?.map((post: any) => (
              <Box key={post.id} mb={3}>
                <Link
                  href={`/posts/${post.slug}`}
                  color="reddit.400"
                  fontWeight="semibold"
                  fontSize="md"
                  _hover={{ textDecoration: "underline" }}
                >
                  {post.title}
                </Link>
              </Box>
            ))}
          </Box>

          <Box
            bg="white"
            borderRadius="md"
            boxShadow="md"
            p={8}
            w={{ base: "100%", md: "40%" }}
          >
            <Text fontSize="lg" fontWeight="bold" mb={3}>
              Liked Posts
            </Text>
            {likedPosts.data?.posts?.length === 0 && (
              <Text color="gray.500">No posts yet.</Text>
            )}
            {likedPosts.data?.posts?.map((post: any) => (
              <Box key={post.id} mb={3}>
                <Link
                  href={`/posts/${post.slug}`}
                  color="reddit.400"
                  fontWeight="semibold"
                  _hover={{ textDecoration: "underline" }}
                >
                  {post.title}
                </Link>
                <Text as="span" ml={2} color="gray.500" fontSize="sm">
                  by {post.user.username}
                </Text>
              </Box>
            ))}
          </Box>
        </Flex>
      </Container>
    </Flex>
  );
}
