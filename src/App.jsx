import React from "react";
import {
  Box,
  Container,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  Image
} from "@chakra-ui/react";
import SocialPostingForm from "./components/SocialPostingForm";

function App() {
  const bgColor = useColorModeValue("gray.50", "gray.900");
  const headerBgColor = useColorModeValue("white", "gray.800");
  const headerColor = useColorModeValue("gray.800", "white");

  return (
    <Box bg={bgColor} minHeight="100vh">
      <Box
        bg={headerBgColor}
        boxShadow="sm"
        position="fixed"
        width="full"
        zIndex="banner"
      >
        <Container maxW="container.xl">
          <Flex alignItems="center" height="16" justifyContent="space-between">
            <Heading as="h1" size="xl" color={headerColor}>
              SocialPost
            </Heading>
            <Image
              src="https://img.ayrshare.com/012/ayrshare-logo-lg.png"
              alt="Ayrshare Logo"
              height="40px"
              objectFit="contain"
            />
          </Flex>
        </Container>
      </Box>
      <Container maxW="container.xl" pt="24" pb="8">
        <Flex direction={{ base: "column", md: "row" }} gap="8">
          <Box flex="1">
            <Heading as="h2" size="lg" mb="4">
              Create Post
            </Heading>
            <Text color="gray.600" mb="8">
              Compose and schedule your social media posts across multiple
              platforms.
            </Text>
            <SocialPostingForm />
          </Box>
          <Box w={{ base: "full", md: "320px" }}>
            <Box bg="white" borderRadius="md" p="6" boxShadow="sm">
              <Heading as="h3" size="md" mb="4">
                Tips
              </Heading>
              <Text color="gray.600" fontSize="sm">
                • Keep your posts concise and engaging
                <br />
                • Use relevant hashtags to increase visibility
                <br />
                • Include eye-catching images when possible
                <br />• Schedule posts for optimal times
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default App;
