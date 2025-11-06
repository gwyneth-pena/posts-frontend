import { Button, Field, Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { COMMENTS_CREATE_MUTATION } from "../graphql/comments.mutations";
import toast from "react-hot-toast";

type CommentData = {
  text: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CommentForm({
  operation,
  postId,
  onSuccess,
}: {
  operation: "Add" | "Update";
  postId: string;
  onSuccess?: () => void;
}) {
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
      postId: postId,
    });
    if (result.error) {
      window.location.href = "/login";
    } else {
      toast.success(
        `Comment ${operation === "Add" ? "added" : "updated"} successfully.`
      );
      reset();
      onSuccess?.();
    }
  };

  return (
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
          {operation} Comment
        </Button>
      </Stack>
    </form>
  );
}
