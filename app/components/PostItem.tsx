"use client";

import {
  IconMessageCircle,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { Box, Flex } from "@chakra-ui/react";
import { format } from "date-fns";
import { formatNumber } from "./utils/numbers";
import { useCallback } from "react";
import { useMutation } from "urql";
import {
  VOTE_CREATE_MUTATION,
  VOTE_DELETE_BY_POST_ID_MUTATION,
  VOTE_UPDATE_BY_POST_ID_MUTATION,
} from "../graphql/votes.mutation";
import PostMenu from "./PostMenu";
import { useRouter } from "next/navigation";

export default function PostItem({ post, user }: { post: any; user: any }) {
  const router = useRouter();

  const [, vote] = useMutation(VOTE_CREATE_MUTATION);
  const [, updateVoteByPost] = useMutation(VOTE_UPDATE_BY_POST_ID_MUTATION);
  const [, deleteVoteByPost] = useMutation(VOTE_DELETE_BY_POST_ID_MUTATION);

  const likeOrDislikePost = useCallback(
    async (value: number) => {
      if (!user) {
        router.push("/login");
        return;
      }
      if (post.userVote) {
        await updateVoteByPost({ value, postId: post.id });
        if (value === 1) {
          post.likeCount = post.likeCount + 1;
          post.dislikeCount = post.dislikeCount - 1;
        } else {
          post.likeCount = post.likeCount - 1;
          post.dislikeCount = post.dislikeCount + 1;
        }
      } else if (!post.userVote) {
        await vote({ value, postId: post.id });
        value === 1
          ? (post.likeCount = post.likeCount + 1)
          : (post.dislikeCount = post.dislikeCount + 1);
      }
      post.userVote = value;
    },
    [post.id, vote]
  );

  const removeVote = useCallback(
    async (value: number) => {
      if (!user) {
        router.push("/login");
        return;
      }
      await deleteVoteByPost({ postId: post.id });
      post.userVote = null;
      value === 1 ? post.likeCount-- : post.dislikeCount--;
    },
    [post.id, vote]
  );

  return (
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
        <h4
          style={{ fontWeight: "600" }}
          onClick={() => router.push(`/posts/${post.id}`)}
          className="cursor-pointer hover:underline"
        >
          {post.title}
        </h4>
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
          {post.userVote === 1 ? (
            <IconThumbUpFilled
              onClick={() => removeVote(1)}
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
            />
          ) : (
            <IconThumbUp
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => likeOrDislikePost(1)}
            />
          )}
          <small className="me-3">{formatNumber(post.likeCount || 0)}</small>

          {post.userVote === -1 ? (
            <IconThumbDownFilled
              onClick={() => removeVote(-1)}
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
            />
          ) : (
            <IconThumbDown
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => likeOrDislikePost(-1)}
            />
          )}
          <small className="me-3">{formatNumber(post.dislikeCount || 0)}</small>

          <IconMessageCircle
            size={20}
            stroke={1.5}
            className="me-1 cursor-pointer"
            onClick={() => router.push(`/posts/${post.id}`)}
          />
          <small>{formatNumber(post.commentCount || 0)}</small>
        </div>
      </Flex>
    </Box>
  );
}
