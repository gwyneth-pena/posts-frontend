"use client";

import { Box } from "@chakra-ui/react";
import { useQuery } from "urql";
import { COMMENTS_BY_POST_QUERY } from "../graphql/comments.query";
import { format } from "date-fns";

export default function PostCommentSection({ id }: { id: string }) {
  const [{ data: commentData }] = useQuery({
    query: COMMENTS_BY_POST_QUERY,
    variables: { postId: id },
    requestPolicy: "cache-and-network",
  });

  return (
    <Box w={["100%"]} bg="white" p={6} mb={4} borderRadius="md" boxShadow="md">
      <p className="fw-bold">Comments</p>
      {commentData?.commentsByPost?.map((comment: any) => (
        <div className="bg-gray-100 px-4 py-2" key={comment.id}>
          <small className="text-muted">
            {comment.user.username} |{"  "}
            {format(new Date(Number(comment.createdAt)), "PPP 'at' p")}
          </small>
          <p className="mb-0">{comment.text}</p>
        </div>
      ))}
      {commentData?.commentsByPost?.length === 0 && (
        <p className="text-muted">No comments yet.</p>
      )}
    </Box>
  );
}
