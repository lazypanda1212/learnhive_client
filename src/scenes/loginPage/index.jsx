import React, { useState, useEffect } from "react";
import { Box, Typography, useTheme, useMediaQuery } from "@mui/material";
import Form from "./Form";
import HiveIcon from "@mui/icons-material/Hive";

// Typing effect component
const TypingEffect = () => {
  const messages = ["Hello!", "Welcome!", "Knowledge is Power!"];
  const [currentMessage, setCurrentMessage] = useState("");
  const [index, setIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const typingSpeed = isDeleting ? 50 : 150;
    const nextMessageDelay = 1500;

    const handleTyping = () => {
      const fullMessage = messages[index];
      if (isDeleting) {
        setCurrentMessage(fullMessage.substring(0, charIndex - 1));
        setCharIndex((prev) => prev - 1);
        if (charIndex === 0) {
          setIsDeleting(false);
          setIndex((prev) => (prev + 1) % messages.length);
        }
      } else {
        setCurrentMessage(fullMessage.substring(0, charIndex + 1));
        setCharIndex((prev) => prev + 1);
        if (charIndex === fullMessage.length) {
          setTimeout(() => setIsDeleting(true), nextMessageDelay);
        }
      }
    };

    const timer = setTimeout(handleTyping, typingSpeed);
    return () => clearTimeout(timer);
  }, [charIndex, isDeleting, index, messages]);

  return (
    <Typography fontWeight="bold" fontSize="20px" color="white">
      {currentMessage}
    </Typography>
  );
};

const LoginPage = () => {
  const theme = useTheme();
  const isNonMobileScreens = useMediaQuery("(min-width: 1000px)");
  return (
    <Box>
      {/* Navbar */}
      <Box
        width="100%"
        backgroundColor={theme.palette.primary.main}
        p="1rem 6%"
        display="flex"
        justifyContent="space-between"
        alignItems="center"
      >
        <Typography
          fontWeight="bold"
          fontSize="32px"
          color="white"
          textAlign="left"
          display="flex"
          alignItems="center"
        >
          <HiveIcon sx={{ mr: 1, color: "white" }} /> LearnHive
        </Typography>
        <TypingEffect />
      </Box>

      {/* Form Container */}
      <Box
        width={isNonMobileScreens ? "50%" : "93%"}
        p="2rem"
        m="2rem auto"
        borderRadius="1.5rem"
        backgroundColor={theme.palette.background.alt}
      >
        <Typography fontWeight="500" variant="h5" sx={{ mb: "1.5rem" }}>
          Welcome to LearnHive, the Social Media for Learners!
        </Typography>
        <Form />
      </Box>
    </Box>
  );
};

export default LoginPage;
