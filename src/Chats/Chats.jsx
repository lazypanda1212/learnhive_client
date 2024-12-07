import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Avatar,
  useTheme,
} from "@mui/material";
import Navbar from "../scenes/navbar/index";

const Chats = ({ username, pfp }) => {
  const [messages, setMessages] = useState([
    { _id: 1, username: "Alice", message: "Hi there!", pfp: "/path/to/pfp1.jpg" },
    { _id: 2, username: "Bob", message: "Hello Alice! How are you?", pfp: "/path/to/pfp2.jpg" },
    { _id: 3, username: "Alice", message: "I'm good, thanks! How about you?", pfp: "/path/to/pfp1.jpg" },
    { _id: 4, username: "Bob", message: "I'm doing great, thanks for asking!", pfp: "/path/to/pfp2.jpg" },
    // Add more sample messages here
  ]);
  const [message, setMessage] = useState("");
  const theme = useTheme();

  // Fetch messages from the server (Commented out for now as we're using sample data)
  // const fetchMessages = async () => {
  //   try {
  //     const response = await fetch("http://localhost:5000/api/messages");
  //     const data = await response.json();
  //     setMessages(data);
  //   } catch (error) {
  //     console.error("Error fetching messages:", error);
  //   }
  // };

  // Send a message to the server
  const sendMessage = async () => {
    if (message.trim()) {
      try {
        const newMessage = {
          _id: messages.length + 1,
          username,
          message,
          pfp,
        };
        setMessages([newMessage, ...messages]); // Add new message to the list
        setMessage(""); // Clear input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("Message cannot be empty.");
    }
  };

  useEffect(() => {
    // fetchMessages(); // Uncomment this line if you want to fetch messages from the server
  }, []);

  return (
    <><Navbar /><Box
      sx={{
        backgroundColor: theme.palette.background.default,
        height: "100vh",
        color: theme.palette.text.primary,
      }}
    >
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        height="calc(100vh - 64px)"
        padding="1rem"
      >
        {/* Display Messages */}
        <Box
          marginTop="2rem"
          width="100%"
          maxHeight="50vh"
          overflow="auto"
          sx={{
            backgroundColor: theme.palette.background.paper,
            borderRadius: "8px",
            padding: "1rem",
            boxShadow: 3,
          }}
        >
          {messages.length ? (
            messages.map((msg) => (
              <Box
                key={msg._id}
                display="flex"
                alignItems="center"
                marginBottom="1rem"
              >
                <Avatar src={msg.pfp} alt={msg.username} sx={{ marginRight: "1rem" }} />
                <Box>
                  <Typography variant="body1" fontWeight="bold">
                    {msg.username}:
                  </Typography>
                  <Typography variant="body2">{msg.message}</Typography>
                </Box>
              </Box>
            ))
          ) : (
            <Typography>No messages yet.</Typography>
          )}
        </Box>

        {/* Message Input */}
        <Box display="flex" flexDirection="column" alignItems="center" gap="1rem" marginTop="1rem">
          <TextField
            label="Message"
            variant="filled"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            sx={{ backgroundColor: theme.palette.background.paper, width: "300px" }} />
          <Button variant="contained" onClick={sendMessage}>
            Send
          </Button>
        </Box>
      </Box>
    </Box></>
  );
};

export default Chats;
