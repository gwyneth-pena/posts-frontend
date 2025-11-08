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
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQuery } from "urql";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useSearchParams } from "next/navigation";

type PostData = {
  title: string;
  text: string;
};

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

export default function EditPostForm({ slug }: any) {
  const [{ data: userpostData }] = useQuery({
    query: USER_ME_QUERY,
    requestPolicy: "cache-and-network",
  });

  const [{ data: postData }] = useQuery({
    query: POSTS_GET_ONE_QUERY,
    variables: { slug: slug },
    requestPolicy: "cache-and-network",
  });

  const searchParams = useSearchParams();
  const isSingle = searchParams.get("single") === "true";

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PostData>({
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

  const onSubmit = async (postDataSubmit: PostData) => {
    const result = await executePostEdit({
      id: postData.post.id,
      title: postDataSubmit.title,
      text: postDataSubmit.text,
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
      if (isSingle) {
        window.location.href = `/posts/${postData.post.slug}`;
      } else {
        window.location.href = "/";
      }
    }
  };

  register("text", { required: "Body is required." });
  const text = watch("text");

  if (!userpostData || !postData) return <div>Loading...</div>;
  if (postData.post?.user?.username !== userpostData.userMe.username) {
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
          <ReactQuill
            className="w-100"
            theme="snow"
            value={text}
            onChange={(val) => setValue("text", val, { shouldValidate: true })}
            placeholder="Write something..."
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
