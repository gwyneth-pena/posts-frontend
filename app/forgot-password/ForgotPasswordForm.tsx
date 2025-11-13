"use client";

import { PasswordInput } from "@/components/ui/password-input";
import { Alert, Button, Field, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { USER_RESET_PASSWORD_MUTATION } from "../graphql/users.mutation";
import { GetServerSideProps } from "next";

type ChangePassData = {
  password: string;
  confirmPassword: string;
};

export default function ForgotPasswordForm({ token, selector }: any) {
  const {
    reset,
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ChangePassData>();

  const [mutationResult, executeResetPassword] = useMutation(
    USER_RESET_PASSWORD_MUTATION
  );

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const onSubmit = async (data: ChangePassData) => {
    const result = await executeResetPassword({
      selector: selector,
      token: token,
      password: data.password,
    });

    if (result.error) {
      setSubmitFeedback({
        message: "Invalid token. Try again.",
        type: "error",
      });
    } else {
      setSubmitFeedback({
        message: "Password reset successfully.",
        type: "success",
      });
      reset();
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Heading size="md" mb={2}>
        Change Password
      </Heading>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Fill in the fields below to change your password
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
        <Field.Root invalid={!!errors.password}>
          <Field.Label htmlFor="password"> New Password</Field.Label>
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
          Change Password
        </Button>
      </Stack>
    </form>
  );
}

export const getServerSideProps: GetServerSideProps = async ({ req }) => {
  const sessionId = req.cookies["session_id"];

  if (sessionId) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return { props: {} };
};
