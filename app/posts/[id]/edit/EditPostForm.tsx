"use client";

import { POSTS_UPDATE_MUTATION } from "@/app/graphql/posts.mutation";
import { POSTS_GET_ONE_QUERY } from "@/app/graphql/posts.query.";
import { USER_ME_QUERY } from "@/app/graphql/users.query";
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
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";

type PostpostData = {
  title: string;
  text: string;
};

export default function EditPostForm({ id }: any) {
  const [{ data: userpostData }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [{ data: postData }] = useQuery({
    query: POSTS_GET_ONE_QUERY,
    variables: { id: id },
    requestPolicy: "cache-and-network",
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<PostpostData>({
    defaultValues: {
      title: "",
      text: "",
    },
  });

  const [mutationResult, executePostEdit] = useMutation(POSTS_UPDATE_MUTATION);

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  useEffect(() => {
    if (postData?.post) {
      reset({
        title: postData.post.title,
        text: postData.post.text,
      });
    }
  }, [postData, reset]);

  const onSubmit = async (postData: PostpostData) => {
    const result = await executePostEdit({
      id: id,
      title: postData.title,
      text: postData.text,
    });
    if (result.error) {
      setSubmitFeedback({
        message: "Something went wrong. Try again.",
        type: "error",
      });
    } else {
      setSubmitFeedback({
        message: "Post updated successfully.",
        type: "success",
      });
      reset();
      window.location.href = "/";
    }
  };

  if (!userpostData || !postData) return <div>Loading...</div>;
  if (postData.post.user.username !== userpostData.userMe.username) {
    return <div>You are not authorized to edit this post.</div>;
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="md" mb={2}>
        Edit Post
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
          Update
        </Button>
      </Stack>
    </form>
  );
}
