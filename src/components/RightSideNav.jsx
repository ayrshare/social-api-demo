import { useState, useEffect, useCallback } from "react";
import {
  Box,
  Heading,
  Text,
  Link,
  Button,
  VStack,
  useToast,
  Avatar,
  Wrap,
  WrapItem,
  Tooltip
} from "@chakra-ui/react";
import {
  FaLink,
  FaFacebookF,
  FaXTwitter,
  FaInstagram,
  FaLinkedinIn,
  FaPinterest,
  FaYoutube,
  FaTelegram,
  FaReddit,
  FaTiktok
} from "react-icons/fa6";
import { baseURL } from "../utils/constants";

const socialIcons = {
  facebook: FaFacebookF,
  twitter: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
  tiktok: FaTiktok,
  pinterest: FaPinterest,
  youtube: FaYoutube,
  telegram: FaTelegram,
  reddit: FaReddit
};

const socialColors = {
  facebook: "#1877F2",
  twitter: "#1DA1F2",
  instagram: "#E4405F",
  linkedin: "#0A66C2",
  tiktok: "#000000",
  pinterest: "#BD081C",
  youtube: "#FF0000",
  telegram: "#0088cc",
  reddit: "#FF4500"
};

const RightSideNav = () => {
  const toast = useToast();
  const [activeAccounts, setActiveAccounts] = useState([]);

  const fetchActiveAccounts = useCallback(async () => {
    try {
      const response = await fetch(`${baseURL}/api/user-accounts`);
      if (response.ok) {
        const data = await response.json();
        setActiveAccounts(data.activeSocialAccounts);
      } else {
        throw new Error("Failed to fetch active accounts");
      }
    } catch (error) {
      console.error("Error fetching active accounts:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to fetch active social accounts.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchActiveAccounts();
  }, [fetchActiveAccounts]);

  const handleLinkSocialAccounts = async () => {
    try {
      const response = await fetch(`${baseURL}/api/generate-jwt`);
      if (response.ok) {
        const data = await response.json();
        const width = 800;
        const height = 800;
        const left = window.screen.width / 2 - width / 2;
        const top = window.screen.height / 2 - height / 2;
        window.open(
          data.url,
          "LinkSocialAccounts",
          `toolbar=no, location=no, directories=no, status=no, menubar=no, scrollbars=no, resizable=no, copyhistory=no, width=${width}, height=${height}, top=${top}, left=${left}`
        );
      } else {
        throw new Error("Failed to generate JWT URL");
      }
    } catch (error) {
      console.error("Error linking social accounts:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to link social accounts.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    }
  };

  const handleSocialIconClick = (profileUrl) => {
    if (profileUrl) {
      window.open(profileUrl, "_blank");
    }
  };

  return (
    <VStack spacing={4} align="stretch">
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
          <br />
          • Schedule posts for optimal times
          <br />• Learn more at{" "}
          <Link
            href="https://www.ayrshare.com"
            isExternal
            color="blue.500"
            textDecoration="none"
            _hover={{ textDecoration: "underline" }}
          >
            Ayrshare
          </Link>
        </Text>
      </Box>

      <Box bg="white" borderRadius="md" p="6" boxShadow="sm">
        <Heading as="h3" size="md" mb="4">
          Linked Social Accounts
        </Heading>
        <Button
          leftIcon={<FaLink />}
          colorScheme="teal"
          onClick={handleLinkSocialAccounts}
          mb="4"
          width="100%"
        >
          Link Social Accounts
        </Button>
        {activeAccounts.length > 0 ? (
          <Wrap spacing="2">
            {activeAccounts
              .filter((account) => socialIcons[account.name.toLowerCase()])
              .map((account) => {
                const lowerCaseAccount = account.name.toLowerCase();
                const IconComponent = socialIcons[lowerCaseAccount] || FaLink;
                return (
                  <WrapItem key={account.name}>
                    <Tooltip
                      label={`View ${account.name} profile`}
                      aria-label="A tooltip"
                    >
                      <Avatar
                        icon={<IconComponent />}
                        bg={socialColors[lowerCaseAccount] || "gray.500"}
                        color="white"
                        cursor="pointer"
                        onClick={() =>
                          handleSocialIconClick(account.profileUrl)
                        }
                      />
                    </Tooltip>
                  </WrapItem>
                );
              })}
          </Wrap>
        ) : (
          <Text color="gray.600" fontSize="sm">
            No linked accounts yet.
          </Text>
        )}
      </Box>
    </VStack>
  );
};

export default RightSideNav;
