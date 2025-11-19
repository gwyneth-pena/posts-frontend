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
  const [, updateVote] = useMutation(VOTE_UPDATE_BY_POST_ID_MUTATION);
  const [, deleteVote] = useMutation(VOTE_DELETE_BY_POST_ID_MUTATION);

  const [userVote, setUserVote] = useState(post.userVote);
  const [likeCount, setLikeCount] = useState(post.likeCount || 0);
  const [dislikeCount, setDislikeCount] = useState(post.dislikeCount || 0);
  const [isVoting, setIsVoting] = useState(false);

  const redirectIfNotLogged = useCallback(() => {
    if (!user) {
      router.push("/login");
      return true;
    }
    return false;
  }, [user, router]);

  const applyVoteChange = (value: number, increment: boolean) => {
    const diff = increment ? 1 : -1;
    if (value === 1) setLikeCount((prev: any) => prev + diff);
    else setDislikeCount((prev: any) => prev + diff);
  };

  const likeOrDislikePost = useCallback(
    async (value: number) => {
      if (redirectIfNotLogged()) return;
      if (isVoting) return;

      setIsVoting(true);

      try {
        const isSame = userVote === value;
        const isNew = userVote === null;

        let res;

        if (isSame) {
          res = await deleteVote({ postId: post.id });
          if (res.data) {
            setUserVote(null);
            applyVoteChange(value, false);
          }
          return;
        }

        if (isNew) {
          res = await vote({ postId: post.id, value });
          if (res.data) {
            setUserVote(value);
            applyVoteChange(value, true);
          }
          return;
        }

        res = await updateVote({ postId: post.id, value });
        if (res.data) {
          setUserVote(value);
          applyVoteChange(value, true);
          applyVoteChange(value === 1 ? -1 : 1, false);
        }
      } finally {
        setIsVoting(false);
      }
    },
    [
      userVote,
      post.id,
      vote,
      updateVote,
      deleteVote,
      redirectIfNotLogged,
      isVoting,
    ]
  );

  const removeVote = useCallback(
    async (value: number) => {
      if (redirectIfNotLogged()) return;
      if (isVoting) return;

      setIsVoting(true);

      try {
        const res = await deleteVote({ postId: post.id });
        if (res.data) {
          setUserVote(null);
          applyVoteChange(value, false);
        }
      } finally {
        setIsVoting(false);
      }
    },
    [deleteVote, redirectIfNotLogged, isVoting]
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
          style={{ fontWeight: 600 }}
          className="cursor-pointer hover:underline"
          onClick={() => router.push(`/posts/${post.slug}`)}
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
          {/* LIKE BUTTON */}
          {userVote === 1 ? (
            <IconThumbUpFilled
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => !isVoting && removeVote(1)}
            />
          ) : (
            <IconThumbUp
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => !isVoting && likeOrDislikePost(1)}
            />
          )}
          <small className="me-3">{formatNumber(likeCount)}</small>

          {/* DISLIKE BUTTON */}
          {userVote === -1 ? (
            <IconThumbDownFilled
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => !isVoting && removeVote(-1)}
            />
          ) : (
            <IconThumbDown
              size={20}
              stroke={1.5}
              className="me-1 cursor-pointer"
              onClick={() => !isVoting && likeOrDislikePost(-1)}
            />
          )}
          <small className="me-3">{formatNumber(dislikeCount)}</small>

          {/* COMMENTS */}
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
