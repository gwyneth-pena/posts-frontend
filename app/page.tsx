import { Box, Button, Container, Flex } from "@chakra-ui/react";
import { POSTS_QUERY } from "./graphql/posts.query.";
import Link from "next/link";
import { Metadata } from "next";
import {
  IconMessageCircle,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { format } from "date-fns";
import PostMenu from "./components/PostMenu";
import { formatNumber } from "./components/utils/numbers";
import { createUrqlClient } from "./lib/urql-server";

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
              <PostMenu post={post} />
            </Flex>

            <small className="text-muted">{post.user.username}</small>
            <p
              className="mt-3"
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              {post.text.replace(/<[^>]+>/g, "")}
            </p>
            <Flex justify="space-between" align="start">
              <small className="text-muted">
                {format(new Date(Number(post.createdAt)), "PPP 'at' p")}
              </small>
              <div className="d-flex">
                <div className="d-flex">
                  {post.userVote === 1 ? (
                    <IconThumbUpFilled
                      size={20}
                      stroke={1.5}
                      className="me-1"
                    />
                  ) : (
                    <IconThumbUp size={20} stroke={1.5} className="me-1" />
                  )}
                  <small className="me-3">
                    {formatNumber(post.likeCount || 0)}
                  </small>
                  {post.userVote === -1 ? (
                    <IconThumbDownFilled
                      size={20}
                      stroke={1.5}
                      className="me-1"
                    />
                  ) : (
                    <IconThumbDown size={20} stroke={1.5} className="me-1" />
                  )}
                  <small className="me-3">
                    {formatNumber(post.dislikeCount || 0)}
                  </small>
                  <IconMessageCircle size={20} stroke={1.5} className="me-1" />
                  <small>{formatNumber(post.commentCount || 0)}</small>
                </div>
              </div>
            </Flex>
          </Box>
        ))}
      </Container>
    </Flex>
  );
}
