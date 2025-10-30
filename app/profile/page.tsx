import { Container, Box, Flex, HStack, Text } from "@chakra-ui/react";
import { Metadata } from "next";
import { USER_ME_QUERY } from "../graphql/users.query";
import { createUrqlClient } from "../lib/urql-client";
import { cookies } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore?.toString();
  const { client } = createUrqlClient(cookieHeader || "");

  const res = await client
    .query(USER_ME_QUERY, {
      requestPolicy: "cache-and-network",
    })
    .toPromise();
  const username = res.data?.userMe?.username ?? "User";

  return {
    title: `${username}'s Profile - MyPosts`,
    description: `View ${username}'s profile on MyPosts`,
  };
}

export default async function Profile() {
  const cookieStore = await cookies();
  const cookieHeader = cookieStore?.toString();
  const { client } = createUrqlClient(cookieHeader || "");

  const userMeRes = await client
    .query(USER_ME_QUERY, {
      requestPolicy: "cache-and-network",
    })
    .toPromise();

  const user = userMeRes.data?.userMe;

//   const postsRes = await client
//     .query(POSTS_QUERY, {
//       requestPolicy: "cache-and-network",
//     })
//     .toPromise();

//   const posts = postsRes.data?.posts;

  if (!user) {
    return (
      <Flex minH="80vh" align="center" justify="center">
        <Text>You are not logged in.</Text>
      </Flex>
    );
  }

  return (
    <Flex minH="80vh" bg="gray.100" justify="center">
      <Container maxW="100%" py={10} px={4}>
        <Box
          as="header"
          w="100%"
          bg="white"
          boxShadow="sm"
          py={4}
          px={{ base: 4, md: 8 }}
          position="sticky"
          top={0}
          zIndex={1000}
        >
          <Flex
            maxW="1200px"
            mx="auto"
            align="center"
            justify="space-between"
            direction={{ base: "column", md: "row" }}
          >
            <Text fontSize="xl" fontWeight="bold" mb={{ base: 2, md: 0 }}>
              My Profile
            </Text>
            <HStack padding={3} align="center">
              <Box textAlign={{ base: "center", md: "left" }}>
                <Text fontWeight="bold">{user.username}</Text>
                <Text fontSize="sm" color="gray.500">
                  {user.email ?? "No email"}
                </Text>
              </Box>
            </HStack>
          </Flex>
        </Box>

        {/* Profile content */}
        <Box
          w={["100%", "90%", "600px"]}
          bg="white"
          p={8}
          mt={4}
          borderRadius="md"
          boxShadow="md"
        ></Box>
      </Container>
    </Flex>
  );
}
