import express from "express";
import multer from "multer";
import axios from "axios";
import { config } from "dotenv";
import { env } from "process";
import fs from "fs";
import FormData from "form-data";
import cors from "cors";

const BASE_AYRSHARE = "https://api.ayrshare.com/api";

config(); // Load environment variables

const corsOptions = {};

const app = express();
app.use(cors(corsOptions));
const upload = multer({ dest: "uploads/" });

// WARNING: This CORS configuration allows all origins and is not secure for production use
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET, POST, OPTIONS, PUT, PATCH, DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

app.use(express.json());

console.warn(
  "WARNING: Server is configured to accept CORS requests from all origins. This is not secure for production use."
);

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

const readPrivateKey = async (privateKeyPath) => {
  try {
    const privateKey = await fs.readFileSync(privateKeyPath, {
      encoding: "utf8"
    });
    return privateKey.trim();
  } catch (error) {
    console.error("Error reading private key file:", error);
    throw new Error("Failed to read private key file");
  }
};

// Updated endpoint to generate JWT URL with required parameters
app.get("/api/generate-jwt", async (req, res) => {
  try {
    const privateKey = await readPrivateKey(env.AYRSHARE_PRIVATE_KEY);

    const jwtData = {
      domain: env.AYRSHARE_DOMAIN,
      privateKey,
      profileKey: env.AYRSHARE_PROFILE_KEY,
      verify: true
    };

    const response = await axios.post(
      `${BASE_AYRSHARE}/profiles/generateJWT`,
      jwtData,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.AYRSHARE_API_KEY}`
        }
      }
    );

    res.json({ url: response.data.url });
  } catch (error) {
    console.error(
      "Error generating JWT URL:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to generate JWT URL" });
  }
});

// New endpoint to fetch user's active social accounts
app.get("/api/user-accounts", async (req, res) => {
  try {
    const response = await axios.get(`${BASE_AYRSHARE}/user`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${env.AYRSHARE_API_KEY}`
      }
    });

    const { displayNames } = response.data;
    const accountsWithUrls = displayNames.map((account) => ({
      name: account.platform,
      profileUrl: account.profileUrl
    }));

    res.json({ activeSocialAccounts: accountsWithUrls });
  } catch (error) {
    console.error(
      "Error fetching user accounts:",
      error.response?.data || error.message
    );
    res.status(500).json({ error: "Failed to fetch user accounts" });
  }
});

const PORT = env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
