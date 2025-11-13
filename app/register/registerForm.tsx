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
} from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { USER_CREATE_MUTATION } from "../graphql/users.mutation";
import { useState } from "react";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type RegisterData = {
  username: string;
  password: string;
  confirmPassword: string;
  email?: string;
};

export default async function RegisterForm() {
  const sessionCookie = (await cookies()).get("session_id")?.value;

  if (sessionCookie) {
    redirect("/");
  }

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm<RegisterData>();

  const [mutationResult, executeUserCreation] =
    useMutation(USER_CREATE_MUTATION);

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const onSubmit = async (data: RegisterData) => {
    const result = await executeUserCreation({
      data: {
        username: data.username,
        password: data.password,
        email: data.email,
      },
    });

    if (result.error) {
      if (
        result.error.graphQLErrors?.[0]?.message
          ?.toLowerCase()
          .includes("duplicate") &&
        result.error.graphQLErrors?.[0]?.message
          ?.toLowerCase()
          .includes("user_email")
      ) {
        setSubmitFeedback({
          message: "User with that email already exists.",
          type: "error",
        });
      } else {
        setSubmitFeedback({
          message: "User with that username already exists.",
          type: "error",
        });
      }
    } else {
      setSubmitFeedback({
        message: "User created successfully.",
        type: "success",
      });
      reset();
      window.location.href = "/";
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="md" mb={2}>
        Create Account
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Fill in your details to register a new account
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
              pattern: {
                value: /^\S+$/,
                message: "Username cannot contain spaces.",
              },
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.username?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.email}>
          <Field.Label htmlFor="email">Email</Field.Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required.",
              pattern: {
                value: /^\S+@\S+$/i,
                message: "Email is invalid.",
              },
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.password}>
          <Field.Label htmlFor="password">Password</Field.Label>
          <PasswordInput
            id="password"
            placeholder="Enter your password"
            {...register("password", {
              required: "Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.password?.message}</Field.ErrorText>
        </Field.Root>

        <Field.Root invalid={!!errors.confirmPassword}>
          <Field.Label htmlFor="confirmPassword">Confirm Password</Field.Label>
          <PasswordInput
            id="confirmPassword"
            placeholder="Re-enter your password"
            {...register("confirmPassword", {
              required: "Confirm Password is required.",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters.",
              },
              validate: (value) =>
                value === watch("password") || "Passwords must match.",
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.confirmPassword?.message}</Field.ErrorText>
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
          Sign Up
        </Button>
      </Stack>
    </form>
  );
}
