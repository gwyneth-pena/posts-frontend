"use client";

import { Box } from "@chakra-ui/react";
import { useQuery } from "urql";
import { COMMENTS_BY_POST_QUERY } from "../graphql/comments.query";
import "react-quill/dist/quill.snow.css";
import { useRef, useEffect } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { USER_ME_QUERY } from "../graphql/users.query";
import { useRouter } from "next/navigation";

export default function PostCommentSection({ id }: { id: string }) {
  const router = useRouter();
  const lastCommentRef = useRef<HTMLDivElement | null>(null);

  const [{ data: userMeData }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [{ data: commentData, fetching }] = useQuery({
    query: COMMENTS_BY_POST_QUERY,
    variables: { postId: id },
    requestPolicy: "cache-and-network",
  });

  const scrollIntoView = () => {
    lastCommentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  useEffect(() => {
    if (
      !fetching &&
      (!commentData?.commentsByPost || commentData.commentsByPost === null)
    ) {
      router.replace("/");
    }
  }, [fetching, commentData, router]);

  if (fetching) return <p>Loading comments...</p>;

  if (
    !commentData?.commentsByPost ||
    !Array.isArray(commentData.commentsByPost)
  ) {
    return null;
  }

  return (
    <Box w={["100%"]} bg="white" p={6} mb={4} borderRadius="md" boxShadow="md">
      <p className="fw-bold">Comments</p>

      {commentData.commentsByPost.length === 0 && (
        <p className="text-muted">No comments yet.</p>
      )}

      {commentData.commentsByPost.map((comment: any, idx: number) => (
        <CommentItem
          ref={
            idx === commentData.commentsByPost.length - 1
              ? lastCommentRef
              : null
          }
          comment={comment}
          userMe={userMeData?.userMe}
          key={comment.id}
          onSuccess={scrollIntoView}
        />
      ))}

      <div className="mt-3">
        <CommentForm operation="Add" postId={id} onSuccess={scrollIntoView} />
      </div>
    </Box>
  );
}
