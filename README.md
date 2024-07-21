# SocialPost

SocialPost is a web application that allows users to compose, schedule, and post content to multiple social media platforms simultaneously. Built with React and Node.js, it leverages the Ayrshare API to manage social media posts across various networks. It is built upon [Ayrshare's Social Media API](https://www.ayrshare.com)

## Features

- Compose posts with text and media (images/videos).
- Schedule posts for future publication.
- Post to multiple social networks (Facebook, Instagram, LinkedIn, TikTok, X/Twitter).
- View post history and status.
- Responsive design for desktop and mobile use.
- See [Ayrshare's API Docs](https://docs.ayrshare.com) for more info.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- Node.js (v18.0.0 or later)
- npm (v8.0.0 or later)
- An signed up [Ayrshare](https://app.ayrshare.com) and obtained an [Ayrshare API key](https://docs.ayrshare.com/rest-api/overview#watch-how-to-use-the-social-api)

## Installation

1. Clone the repository:

   ```markdown
   git clone https://github.com/yourusername/socialpost.git
   cd socialpost
   ```

2. Install dependencies for both frontend and backend:

   ```markdown
   cd frontend
   npm install
   cd ../functions
   npm install
   ```

3. Create a `.env` file in the backend directory with your Ayrshare API key:

   ```markdown
   AYRSHARE_API_KEY=your_api_key_here
   ```

## Configuration

1. Frontend: Update the `baseURL` in `src/components/SocialPostingForm.jsx` if your backend is not running on `http://localhost:3001`.

2. Backend: Update the `corsOptions` in `server.js` if your frontend is not running on `http://localhost:5173`.

## Running the Application

1. Start the backend server:

   ```markdown
   cd backend
   npm start
   ```

2. In a new terminal, start the frontend development server:

   ```markdown
   cd frontend
   npm run dev
   ```

3. Open your browser and navigate to `http://localhost:5173` (or the port specified by Vite).

## Usage

1. Compose your post by entering text in the text area.
2. Optionally, upload an image or video by clicking the image icon.
3. Select the social networks you want to post to by checking the corresponding boxes.
4. If you want to schedule the post, click the calendar icon and select a date and time.
5. Click "Post Now" or "Schedule Post" to submit your post.
6. View your post history in the timeline below the posting form.

## Contributing

Contributions to SocialPost are welcome. Please follow these steps:

1. Fork the repository.
2. Create a new branch: `git checkout -b <branch_name>`.
3. Make your changes and commit them: `git commit -m '<commit_message>'`
4. Push to the original branch: `git push origin <project_name>/<location>`
5. Create the pull request.

Alternatively, see the GitHub documentation on [creating a pull request](https://help.github.com/articles/creating-a-pull-request/).

## License

This project uses the following license: [MIT License](https://opensource.org/license/mit).

## Contact

If you want to contact us, you can reach us via chat at <https://www.ayrshare.com>.

## Acknowledgements

- [Ayrshare](https://www.ayrshare.com) for providing the social media posting API.
- [React](https://reactjs.org/)
- [Chakra UI](https://chakra-ui.com/)
- [Node.js](https://nodejs.org/)
- [Express](https://expressjs.com/)