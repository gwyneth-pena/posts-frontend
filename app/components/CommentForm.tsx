import { Button, Field, Stack } from "@chakra-ui/react";
import dynamic from "next/dynamic";
import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import {
  COMMENT_UPDATE_MUTATION,
  COMMENTS_CREATE_MUTATION,
} from "../graphql/comments.mutations";
import toast from "react-hot-toast";

type CommentData = {
  text: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function CommentForm({
  operation,
  initialValue = "",
  postId = "",
  commentId = "",
  onSuccess,
}: {
  operation: "Add" | "Update";
  initialValue?: string;
  postId?: string;
  commentId?: string;
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
      text: initialValue,
    },
  });

  useEffect(() => {
    setValue("text", initialValue);
  }, [initialValue, setValue]);

  register("text", {
    required: "Text is required.",
    validate: (value) => {
      const stripped = value.replace(/<(.|\n)*?>/g, "").trim();
      return stripped.length > 0 || "Text is required.";
    },
  });

  const text = watch("text");

  const [createCommentResult, executeCommentCreate] = useMutation(
    COMMENTS_CREATE_MUTATION
  );

  const [updateCommentResult, executeCommentUpdate] = useMutation(
    COMMENT_UPDATE_MUTATION
  );

  const onSubmit = async (commentData: CommentData) => {
    let result: any;
    if (operation === "Add") {
      result = await executeCommentCreate({
        text: commentData.text,
        postId: postId,
      });
    } else {
      result = await executeCommentUpdate({
        id: commentId,
        text: commentData.text,
      });
    }
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
          marginTop={1}
          type="submit"
          size="sm"
          width="full"
          rounded="md"
          bg={operation === "Add" ? "reddit.500" : "gray.500"}
          loading={createCommentResult.fetching || updateCommentResult.fetching}
          loadingText="Please wait..."
        >
          {operation} Comment
        </Button>
      </Stack>
    </form>
  );
}
