import { useState, useCallback, useMemo, useEffect } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  Box,
  Button,
  Checkbox,
  Flex,
  FormControl,
  Textarea,
  VStack,
  HStack,
  useToast,
  Text,
  IconButton,
  Image,
  useColorModeValue,
  Wrap,
  WrapItem,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  SimpleGrid,
  Card,
  CardBody,
  CardFooter,
  Badge
} from "@chakra-ui/react";
import {
  FaFacebookF,
  FaInstagram,
  FaImage,
  FaCalendarAlt,
  FaLinkedinIn,
  FaTimes
} from "react-icons/fa";
import { FaTiktok } from "react-icons/fa6";
import { SiX } from "react-icons/si";

const baseURL = "http://localhost:3001";

const PostTimelineItem = ({ post }) => {
  const bgColor = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  return (
    <Card bg={bgColor} borderColor={borderColor} borderWidth="1px">
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
        <HStack spacing={2}>
          {post.platforms.map((platform) => (
            <Badge
              key={platform}
              colorScheme={
                platform === "facebook"
                  ? "facebook"
                  : platform === "instagram"
                  ? "pink"
                  : "gray"
              }
            >
              {platform}
            </Badge>
          ))}
          <Badge colorScheme={post.status === "success" ? "green" : "red"}>
            {post.status}
          </Badge>
        </HStack>
      </CardFooter>
    </Card>
  );
};

const SocialPostingForm = () => {
  const [post, setPost] = useState({ text: "", media: null });
  const [networks, setNetworks] = useState({
    facebook: false,
    instagram: false,
    linkedin: false,
    tiktok: false,
    x: false
  });
  const [mediaPreview, setMediaPreview] = useState(null);
  const [mediaType, setMediaType] = useState(null);
  const [scheduledDate, setScheduledDate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [postHistory, setPostHistory] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();

  const bgColor = useColorModeValue("white", "gray.700");

  const handleTextChange = (e) => {
    setPost({ ...post, text: e.target.value });
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPost({ ...post, media: file });
      setMediaType(file.type.split("/")[0]); // 'image' or 'video'

      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setPost({ ...post, media: null });
      setMediaPreview(null);
      setMediaType(null);
    }
  };

  const handleNetworkChange = useCallback((network) => {
    setNetworks((prev) => {
      const newNetworks = { ...prev, [network]: !prev[network] };
      return newNetworks;
    });
  }, []);

  const handleSchedule = (date) => {
    setScheduledDate(date);
    onClose();
  };

  const handleRemoveScheduledDate = () => {
    setScheduledDate(null);
  };

  const fetchPostHistory = useCallback(async () => {
    setIsLoadingHistory(true);
    try {
      const response = await fetch(`${baseURL}/api/post-history`);
      if (response.ok) {
        const data = await response.json();
        setPostHistory(data);
      } else {
        throw new Error("Failed to fetch post history");
      }
    } catch (error) {
      console.error("Error fetching post history:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to fetch post history.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoadingHistory(false);
    }
  }, [toast]);

  useEffect(() => {
    fetchPostHistory();
  }, [fetchPostHistory]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append("text", post.text);
    if (post.media) {
      formData.append("media", post.media);
    }
    formData.append("networks", JSON.stringify(networks));
    if (scheduledDate) {
      formData.append("scheduledDate", scheduledDate.toISOString());
    }

    try {
      const response = await fetch(`${baseURL}/api/post`, {
        method: "POST",
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        toast({
          title: scheduledDate ? "Post scheduled." : "Post submitted.",
          description: scheduledDate
            ? `Your post was scheduled for ${scheduledDate.toLocaleString()}.`
            : "Your post was successfully submitted.",
          status: "success",
          duration: 3000,
          isClosable: true
        });
        setPost({ text: "", media: null });
        setNetworks({
          facebook: false,
          instagram: false,
          linkedin: false,
          tiktok: false,
          x: false
        });
        setMediaPreview(null);
        setMediaType(null);
        setScheduledDate(null);
        console.log("Post result:", result);
        fetchPostHistory(); // Refresh the post history
      } else {
        throw new Error("Failed to submit post");
      }
    } catch (error) {
      console.error("Error submitting post:", error);
      toast({
        title: "An error occurred.",
        description: "Unable to submit your post.",
        status: "error",
        duration: 3000,
        isClosable: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  const networkOptions = [
    { name: "facebook", icon: FaFacebookF, color: "facebook" },
    { name: "instagram", icon: FaInstagram, color: "pink" },
    { name: "linkedin", icon: FaLinkedinIn, color: "linkedin" },
    { name: "tiktok", icon: FaTiktok, color: "blue" },
    { name: "x", icon: SiX, color: "gray" }
  ];

  const isAnyNetworkSelected = useMemo(() => {
    return Object.values(networks).some((value) => value);
  }, [networks]);

  return (
    <Box>
      <Box
        as="form"
        onSubmit={handleSubmit}
        bg={bgColor}
        borderRadius="lg"
        boxShadow="md"
        p={6}
        mb={8}
      >
        <VStack spacing={6} align="stretch">
          <FormControl>
            <Textarea
              value={post.text}
              onChange={handleTextChange}
              placeholder="What would you like to share?"
              size="lg"
              rows={4}
              resize="vertical"
            />
          </FormControl>

          {mediaPreview && (
            <Box
              width="250px"
              height="250px"
              borderRadius="md"
              overflow="hidden"
              margin="0 auto"
            >
              {mediaType === "image" ? (
                <Image
                  src={mediaPreview}
                  alt="Preview"
                  objectFit="cover"
                  width="100%"
                  height="100%"
                />
              ) : (
                <video
                  src={mediaPreview}
                  controls
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                >
                  Your browser does not support the video tag.
                </video>
              )}
            </Box>
          )}

          <Flex justify="space-between" align="center" flexWrap="wrap">
            <HStack spacing={4} mb={{ base: 4, md: 0 }}>
              <IconButton
                as="label"
                htmlFor="media-upload"
                aria-label="Upload Media"
                icon={<FaImage />}
                cursor="pointer"
              />
              <input
                id="media-upload"
                type="file"
                onChange={handleMediaChange}
                accept="image/*,video/*"
                style={{ display: "none" }}
              />
              <IconButton
                aria-label="Schedule Post"
                icon={<FaCalendarAlt />}
                onClick={onOpen}
              />
            </HStack>
            <Wrap spacing={4}>
              {networkOptions.map((network) => (
                <WrapItem key={network.name}>
                  <Checkbox
                    isChecked={networks[network.name]}
                    onChange={() => handleNetworkChange(network.name)}
                    colorScheme={network.color}
                  >
                    <HStack spacing={2}>
                      <Box as={network.icon} />
                      <Text fontSize="sm" textTransform="capitalize">
                        {network.name}
                      </Text>
                    </HStack>
                  </Checkbox>
                </WrapItem>
              ))}
            </Wrap>
          </Flex>

          {scheduledDate && (
            <HStack>
              <Text fontSize="sm" color="blue.500">
                Scheduled for: {scheduledDate.toLocaleString()}
              </Text>
              <IconButton
                size="xs"
                icon={<FaTimes />}
                aria-label="Remove scheduled date"
                onClick={handleRemoveScheduledDate}
              />
            </HStack>
          )}

          <Button
            type="submit"
            colorScheme="blue"
            size="lg"
            isDisabled={!isAnyNetworkSelected || isLoading}
            isLoading={isLoading}
            loadingText="Posting..."
          >
            {scheduledDate ? "Schedule Post" : "Post Now"}
          </Button>
        </VStack>
      </Box>

      <Box mt={8}>
        <Text fontSize="3xl" fontWeight="bold" mb={4}>
          Post Timeline
        </Text>
        {isLoadingHistory ? (
          <Spinner />
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {postHistory?.map((post) => {
              return <PostTimelineItem key={post.id} post={post} />;
            })}
          </SimpleGrid>
        )}
      </Box>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Schedule Your Post</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <DatePicker
              selected={scheduledDate}
              onChange={handleSchedule}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              minDate={new Date()}
              inline
            />
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default SocialPostingForm;