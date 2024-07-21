import express from "express";
import multer from "multer";
import axios from "axios";
import { config } from "dotenv";
import { env } from "process";
import cors from "cors";
import fs from "fs";
import FormData from "form-data";

const BASE_AYRSHARE = "https://api.ayrshare.com/api";

config(); // Load environment variables

const corsOptions = {
  origin: "http://localhost:5173", // Allow only requests from your frontend
  optionsSuccessStatus: 200
};

const app = express();
app.use(cors(corsOptions));
app.use(express.json());
const upload = multer({ dest: "uploads/" });

async function uploadMediaToAyrshare(file) {
  try {
    const formData = new FormData();
    formData.append("file", fs.createReadStream(file.path), file.originalname);

    const response = await axios.post(`${BASE_AYRSHARE}/upload`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${env.AYRSHARE_API_KEY}`
      }
    });

    // Delete the temporary file
    fs.unlink(file.path, (err) => {
      if (err) console.error("Error deleting temporary file:", err);
    });

    return response.data.url;
  } catch (error) {
    console.error(
      "Error uploading media to Ayrshare:",
      error.response?.data || error.message
    );
    throw error;
  }
}

app.post("/api/post", upload.single("media"), async (req, res) => {
  try {
    const { text, networks, scheduledDate } = req.body;
    const media = req.file;

    const platforms = Object.entries(JSON.parse(networks))
      .filter(([, value]) => value)
      .map(([key]) => key);

    const postData = {
      post: text,
      platforms
    };

    if (scheduledDate) {
      postData.scheduleDate = new Date(scheduledDate).toISOString();
    }

    if (media) {
      try {
        const mediaUrl = await uploadMediaToAyrshare(media);
        postData.mediaUrls = [mediaUrl];
      } catch (error) {
        console.error("Failed to upload media:", error);
        return res.status(500).json({ error: "Failed to upload media" });
      }
    }

    console.log("Sending Data to Ayrshare:", postData);

    const response = await axios.post(`${BASE_AYRSHARE}/post`, postData, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.AYRSHARE_API_KEY}`
      }
    });

    console.log("Response from Ayrshare:", response.status, response.data);

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error posting to social media:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to post to social media" });
  }
});

app.get("/api/post-history", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_AYRSHARE}/history`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.AYRSHARE_API_KEY}`
      }
    });

    res.status(response.status).json(response.data);
  } catch (error) {
    console.error(
      "Error fetching post history:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch post history" });
  }
});

const PORT = env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
