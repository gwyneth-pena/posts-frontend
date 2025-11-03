"use client";

import { Box, Button, Field, Stack } from "@chakra-ui/react";
import { useMutation, useQuery } from "urql";
import { COMMENTS_BY_POST_QUERY } from "../graphql/comments.query";
import { format } from "date-fns";
import { useForm } from "react-hook-form";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import { COMMENTS_CREATE_MUTATION } from "../graphql/comments.mutations";
import toast from "react-hot-toast";

type CommentData = {
  text: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function PostCommentSection({ id }: { id: string }) {
  const [{ data: commentData }] = useQuery({
    query: COMMENTS_BY_POST_QUERY,
    variables: { postId: id },
    requestPolicy: "cache-and-network",
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CommentData>({
    defaultValues: {
      text: "",
    },
  });

  register("text", {
    required: "Text is required.",
    validate: (value) => {
      const stripped = value.replace(/<(.|\n)*?>/g, "").trim();
      return stripped.length > 0 || "Text is required.";
    },
  });

  const text = watch("text");

  const [mutationResult, executeCommentCreate] = useMutation(
    COMMENTS_CREATE_MUTATION
  );

  const onSubmit = async (commentData: CommentData) => {
    const result = await executeCommentCreate({
      text: commentData.text,
      postId: id,
    });
    if (result.error) {
      window.location.href = "/login";
    } else {
      toast.success("Comment added successfully.");
      reset();
      setTimeout(() => window.location.reload(), 1000);
    }
  };

  return (
    <Box w={["100%"]} bg="white" p={6} mb={4} borderRadius="md" boxShadow="md">
      <p className="fw-bold">Comments</p>
      {commentData?.commentsByPost?.map((comment: any) => (
        <div className="bg-gray-100 px-4 py-2 mb-2" key={comment.id}>
          <small className="text-muted">
            {comment.user.username} |{"  "}
            {format(new Date(Number(comment.createdAt)), "PPP 'at' p")}
          </small>
          <div
            className="mb-0"
            dangerouslySetInnerHTML={{ __html: comment.text }}
          ></div>
        </div>
      ))}
      {commentData?.commentsByPost?.length === 0 && (
        <p className="text-muted">No comments yet.</p>
      )}
      <div className="mt-3">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack>
            <Field.Root invalid={!!errors.text}>
              <ReactQuill
                value={text}
                className="w-100"
                theme="snow"
                onChange={(val) => setValue("text", val)}
                placeholder="Write something..."
              />
              {errors.text && (
                <Field.ErrorText>{errors.text.message}</Field.ErrorText>
              )}{" "}
            </Field.Root>
            <Button
              marginTop={2}
              type="submit"
              size="lg"
              colorScheme="blue"
              width="full"
              rounded="md"
              bg="reddit.500"
              loading={mutationResult.fetching}
              loadingText="Please wait..."
            >
              Add Comment
            </Button>
          </Stack>
        </form>
      </div>
    </Box>
  );
}
