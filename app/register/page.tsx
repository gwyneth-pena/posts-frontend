import { Container, Box, Flex } from "@chakra-ui/react";
import { Metadata } from "next";
import RegisterForm from "./registerForm";

export const metadata: Metadata = {
  title: "Register - MyPosts",
  description: "Create an account to join our community",
};

export default function Register() {
  return (
    <Flex
      minH={"80vh"}
      bg="gray.100"
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Container bg="gray.100" maxW="100%" centerContent py={10} px={4}>
        <Box
          w={["100%", "90%", "600px"]}
          bg="white"
          p={8}
          borderRadius="md"
          boxShadow="md"
        >
          <RegisterForm />
        </Box>
      </Container>
    </Flex>
  );
}
