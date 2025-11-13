"use client";

import {
  IconMessageCircle,
  IconThumbDown,
  IconThumbDownFilled,
  IconThumbUp,
  IconThumbUpFilled,
} from "@tabler/icons-react";
import { Box, Flex, Link } from "@chakra-ui/react";
import { format } from "date-fns";
import { useState, useCallback } from "react";
import { useMutation } from "urql";
import {
  VOTE_CREATE_MUTATION,
  VOTE_DELETE_BY_POST_ID_MUTATION,
  VOTE_UPDATE_BY_POST_ID_MUTATION,
} from "../graphql/votes.mutation";
import PostMenu from "./PostMenu";
import { useRouter } from "next/navigation";
import { formatNumber } from "../utils/numbers";
import { useUser } from "../providers";

export default function PostItem({
  post,
  fromPage,
}: {
  post: any;
  fromPage?: number;
}) {
  const router = useRouter();
  const user = useUser();

  const [, vote] = useMutation(VOTE_CREATE_MUTATION);
  const [, updateVoteByPost] = useMutation(VOTE_UPDATE_BY_POST_ID_MUTATION);
  const [, deleteVoteByPost] = useMutation(VOTE_DELETE_BY_POST_ID_MUTATION);

  const [userVote, setUserVote] = useState(post.userVote);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount || 0);

  const likeOrDislikePost = useCallback(
    async (value: number) => {
      if (!user) {
        router.push("/login");
        return;
      }
      if (userVote) {
        await updateVoteByPost({ value, postId: post.id });
        if (value === 1) {
          setLikeCount((prev: any) => prev + 1);
          setDislikeCount((prev: any) => prev - 1);
        } else {
          setLikeCount((prev: any) => prev - 1);
          setDislikeCount((prev: any) => prev + 1);
        }
      } else {
        await vote({ value, postId: post.id });
        value === 1
          ? setLikeCount((prev: any) => prev + 1)
          : setDislikeCount((prev: any) => prev + 1);
      }
      setUserVote(value);
    },
    [userVote, post.id, vote, updateVoteByPost, router, user]
  );

  const removeVote = useCallback(
    async (value: number) => {
      if (!user) {
        router.push("/login");
        return;
      }
      await deleteVoteByPost({ postId: post.id });
      setUserVote(null);
      value === 1
        ? setLikeCount((prev: any) => prev - 1)
        : setDislikeCount((prev: any) => prev - 1);
    },
    [post.id, deleteVoteByPost, router, user]
  );

  return (
    <Box
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
          onClick={() => router.push(`/posts/${post.slug}`)}
          className="cursor-pointer hover:underline"
        >
          {post.title}
        </h4>
        <PostMenu post={post} fromPage={fromPage} />
      </Flex>

      <Link
        color="gray.500"
        href={`/profile/${post.user.username?.toLowerCase()}`}
      >
        <small className="text-muted">{post.user.username}</small>
      </Link>
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
          {userVote === 1 ? (
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
          <small className="me-3">{formatNumber(likeCount)}</small>

          {userVote === -1 ? (
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
          <small className="me-3">{formatNumber(dislikeCount)}</small>

          <IconMessageCircle
            size={20}
            stroke={1.5}
            className="me-1 cursor-pointer"
            onClick={() => router.push(`/posts/${post.slug}`)}
          />
          <small>{formatNumber(post.commentCount || 0)}</small>
        </div>
      </Flex>
    </Box>
  );
}
