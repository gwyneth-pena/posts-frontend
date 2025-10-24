import { Box, Container, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordEmailForm from "./ForgotPasswordEmailForm";

export const metadata: Metadata = {
  title: "Change Password - MyPosts",
  description: "Change your password to continue",
};

export default async function ForgotPassword({ searchParams }: any) {
  const params = (await searchParams) ?? null;
  const token = params?.token ?? null;
  const selector = params?.selector ?? null;

  return (
    <Flex
      minH={"80vh"}
      bg="gray.100"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Container maxW="100%" bg="gray.100" centerContent py={10} px={4}>
        <Box
          w={["100%", "90%", "600px"]}
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="md"
        >
          {token && selector ? (
            <ForgotPasswordForm token={token} selector={selector} />
          ) : (
            <ForgotPasswordEmailForm />
          )}
        </Box>
      </Container>
    </Flex>
  );
}
