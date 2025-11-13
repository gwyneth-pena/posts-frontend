"use client";

import { PasswordInput } from "@/components/ui/password-input";
import {
  Button,
  Input,
  Stack,
  Field,
  Alert,
  Heading,
  Text,
  Flex,
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { USER_LOGIN_MUTATION } from "../graphql/users.mutation";
import { useState } from "react";
import Link from "next/link";

type RegisterData = {
  username: string;
  password: string;
};

export default function LoginForm({ next }: any) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<RegisterData>();

  const [mutationResult, executeUserLogin] = useMutation(USER_LOGIN_MUTATION);

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const onSubmit = async (data: RegisterData) => {
    const result = await executeUserLogin({
      username: data.username,
      password: data.password,
    });

    if (result.error) {
      setSubmitFeedback({
        message: "Invalid credentials. Try again.",
        type: "error",
      });
    } else {
      setSubmitFeedback({
        message: "User logged in successfully.",
        type: "success",
      });
      reset();
      window.location.href = next ?? "/";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="md" mb={2}>
        Sign In
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Enter your username and password to continue
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
        <Field.Root invalid={!!errors.username}>
          <Field.Label htmlFor="username">Username</Field.Label>
          <Input
            type="text"
            id="username"
            placeholder="Enter your username"
            {...register("username", {
              required: "Username is required.",
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>
        <Field.Root invalid={!!errors.password}>
          <Field.Label htmlFor="password">Password</Field.Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required.",
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
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
          Sign In
        </Button>
        <Flex justify="flex-end" mt={2}>
          <Text fontSize="sm" color="gray.600">
            Forgot your password?
            <Link href="/forgot-password" className="text-decoration-none">
              {" "}
              <Text as="span" color="reddit.500" fontWeight="bold">
                Reset it
              </Text>
            </Link>
          </Text>
        </Flex>{" "}
      </Stack>
    </form>
  );
}
