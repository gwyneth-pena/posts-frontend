"use client";

import { Box } from "@chakra-ui/react";
import { useQuery } from "urql";
import { COMMENTS_BY_POST_QUERY } from "../graphql/comments.query";
import "react-quill/dist/quill.snow.css";
import { useRef } from "react";
import CommentForm from "./CommentForm";
import CommentItem from "./CommentItem";
import { USER_ME_QUERY } from "../graphql/users.query";
import { POSTS_GET_ONE_QUERY } from "../graphql/posts.query.";

export default function PostCommentSection({ slug }: { slug: string }) {
  const [{ data: userMeData }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const lastCommentRef = useRef<HTMLDivElement | null>(null);

  const [{ data: postData }] = useQuery({
    query: POSTS_GET_ONE_QUERY,
    variables: { slug: slug },
    requestPolicy: "cache-and-network",
  });

  const [{ data: commentData }, reexecuteQuery] = useQuery({
    query: COMMENTS_BY_POST_QUERY,
    variables: { postId: postData?.post?.id },
    requestPolicy: "cache-and-network",
  });

  const scrollIntoView = () => {
    lastCommentRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  return (
    <Box w={["100%"]} bg="white" p={6} mb={4} borderRadius="md" boxShadow="md">
      <p className="fw-bold">Comments</p>
      {!commentData?.commentsByPost ? (
        <p>Loading...</p>
      ) : (
        <>
          {" "}
          {commentData?.commentsByPost?.map((comment: any, idx: number) => (
            <CommentItem
              ref={
                idx === commentData.commentsByPost.length - 1
                  ? lastCommentRef
                  : null
              }
              comment={comment}
              userMe={userMeData?.userMe}
              key={comment.id}
              onSuccess={() => {
                reexecuteQuery({ requestPolicy: "network-only" });
                scrollIntoView();
              }}
            />
          ))}
          {commentData?.commentsByPost?.length === 0 && (
            <p className="text-muted">No comments yet.</p>
          )}
          <div className="mt-3">
            <CommentForm
              operation="Add"
              postId={postData?.post?.id}
              onSuccess={() => {
                reexecuteQuery({ requestPolicy: "network-only" });
                scrollIntoView();
              }}
            />
          </div>
        </>
      )}
    </Box>
  );
}
