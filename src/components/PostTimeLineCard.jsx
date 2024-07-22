import {
  Box,
  Text,
  Image,
  useColorModeValue,
  Wrap,
  Card,
  CardBody,
  CardFooter,
  Badge,
  Link,
  Flex,
  HStack
} from "@chakra-ui/react";
import {
  FaExternalLinkAlt,
  FaCheckCircle,
  FaExclamationTriangle
} from "react-icons/fa";

const PostTimelineCard = ({ post }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");
  const statusBgColor = useColorModeValue("gray.100", "gray.600");

  const socialColors = {
    facebook: "#1877F2",
    instagram: "#d62976",
    linkedin: "#0A66C2",
    tiktok: "#000000",
    x: "#000000",
    twitter: "#000000"
  };

  const renderSocialBadge = (platform) => {
    const postId = post.postIds.find(
      (p) => p.platform.toLowerCase() === platform.toLowerCase()
    );
    const content = (
      <HStack spacing={1}>
        <Text fontSize="xs">
          {platform === "twitter"
            ? "X"
            : platform.charAt(0).toUpperCase() +
              platform.slice(1).toLowerCase()}
        </Text>
        {postId && postId.postUrl && <FaExternalLinkAlt size="0.6em" />}
      </HStack>
    );

    return postId && postId.postUrl ? (
      <Link
        key={platform}
        href={postId.postUrl}
        isExternal
        _hover={{ textDecoration: "none" }}
      >
        <Badge
          bg={socialColors[platform]}
          color="white"
          px={2}
          py={1}
          borderRadius="full"
          fontSize="xs"
          fontWeight="medium"
        >
          {content}
        </Badge>
      </Link>
    ) : (
      <Badge
        key={platform}
        bg={socialColors[platform]}
        color="white"
        px={2}
        py={1}
        borderRadius="full"
        fontSize="xs"
        fontWeight="medium"
      >
        {content}
      </Badge>
    );
  };

  const renderStatusIndicator = () => {
    const isSuccess = post.status === "success";
    return (
      <Flex
        align="center"
        bg={statusBgColor}
        px={3}
        py={2}
        borderRadius="md"
        mb={2}
      >
        {isSuccess ? (
          <FaCheckCircle color="green" size="1em" />
        ) : (
          <FaExclamationTriangle color="red" size="1em" />
        )}
        <Text
          ml={2}
          fontSize="sm"
          fontWeight="medium"
          color={isSuccess ? "green.500" : "red.500"}
        >
          {isSuccess ? "Posted successfully" : "Error posting"}
        </Text>
      </Flex>
    );
  };

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
      {renderStatusIndicator()}
      <CardBody>
        <Text fontSize="sm" mb={2}>
          {post.post}
        </Text>
        {post.mediaUrls && post.mediaUrls.length > 0 && (
          <Box maxH="200px" overflow="hidden" borderRadius="md" mb={2}>
            {post.mediaUrls[0].endsWith(".mp4") ? (
              <video
                src={post.mediaUrls[0]}
                controls
                width="100%"
                height="auto"
              />
            ) : (
              <Image
                src={post.mediaUrls[0]}
                alt="Post media"
                objectFit="cover"
                width="100%"
              />
            )}
          </Box>
        )}
      </CardBody>
      <CardFooter>
        <Wrap spacing={2}>
          {post.platforms.map((platform) => renderSocialBadge(platform))}
        </Wrap>
      </CardFooter>
    </Card>
  );
};

export default PostTimelineCard;
