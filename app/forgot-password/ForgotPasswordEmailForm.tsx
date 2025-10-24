"use client";

import {
  Alert,
  Button,
  Field,
  Heading,
  Input,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation } from "urql";
import { USER_SEND_RESET_PASSWORD_LINK_MUTATION } from "../graphql/users.mutation";

type ChangePassData = {
  email: string;
  password: string;
  confirmPassword: string;
};

export default function ForgotPasswordEmailForm() {
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ChangePassData>();

  const [mutationResult, executeUserSendPasswordLink] = useMutation(
    USER_SEND_RESET_PASSWORD_LINK_MUTATION
  );

  const [submitFeedback, setSubmitFeedback] = useState<{
    message: string;
    type: "success" | "error";
  }>({
    message: "",
    type: "success",
  });

  const onSubmit = async (data: ChangePassData) => {
    const result = await executeUserSendPasswordLink({
      email: data.email,
    });

    if (result.error) {
      setSubmitFeedback({
        message: "Invalid email. Try again.",
        type: "error",
      });
    } else {
      setSubmitFeedback({
        message: "Email sent successfully.",
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
        <Field.Root invalid={!!errors.email}>
          <Field.Label htmlFor="email">Email</Field.Label>
          <Input
            type="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required.",
            })}
            size="lg"
          />
          <Field.ErrorText>{errors.email?.message}</Field.ErrorText>
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
          loadingText="Sending..."
        >
          Send Reset Link
        </Button>
      </Stack>
    </form>
  );
}
