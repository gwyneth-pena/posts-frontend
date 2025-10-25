"use client";

import { POSTS_CREATE_MUTATION } from "@/app/graphql/posts.mutation";
import {
  Alert,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
  Textarea,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";

type PostData = {
  title: string;
  text: string;
};

export default function CreatePostForm() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostData>();

  const [mutationResult, executePostCreate] = useMutation(
    POSTS_CREATE_MUTATION
  );

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const onSubmit = async (data: PostData) => {
    const result = await executePostCreate({
      title: data.title,
      text: data.text,
    });
    if (result.error) {
      setSubmitFeedback({
        message: "Something went wrong. Try again.",
        type: "error",
      });
    } else {
      setSubmitFeedback({
        message: "Post created successfully.",
        type: "success",
      });
      reset();
      window.location.href = "/";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="md" mb={2}>
        Create Post
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Share your thoughts and ideas with the community
      </Text>

      {submitFeedback.message && (
        <Alert.Root status={submitFeedback.type} mb={4} rounded="md">
          <Alert.Indicator />
          <Alert.Content>
            <Alert.Description>{submitFeedback.message}</Alert.Description>
          </Alert.Content>
        </Alert.Root>
      )}

      <Stack>
        <Field.Root invalid={!!errors.title}>
          <Field.Label htmlFor="title">Title</Field.Label>
          <Input
            type="text"
            id="title"
            placeholder="Enter post title"
            {...register("title", {
              required: "Title is required.",
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.title?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.text}>
          <Field.Label htmlFor="text">Body</Field.Label>
          <Textarea
            placeholder="Write your post here"
            id="text"
            {...register("text", { required: "Body is required." })}
            size="lg"
          />
          <Field.ErrorText>{errors.text?.message}</Field.ErrorText>
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
          Submit
        </Button>
      </Stack>
    </form>
  );
}
