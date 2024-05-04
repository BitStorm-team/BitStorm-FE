import React, { useState, useEffect } from "react";
import HomePage from "./components/homepage";

function App() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  // code của
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/items");

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      setVideos(data);
    } catch (error) {
      console.error("Error fetching data:", error.message);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div>
      {/* <Header /> */}
      <HomePage title="Body" color="red" />
      {/* <Footer /> */}
      <HomePage title="Main" color="green" />
      <div className="custom">custom</div>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <ul>
          {videos.map((video) => (
            <li key={video.id}>
              <h2>{video.title}</h2>
              <p>{video.description}</p>
              <p>Duration: {video.duration} seconds</p>
              <p>Views: {video.view}</p>
              <p>Likes: {video.like_count}</p>
              <p>Dislikes: {video.dislike_count}</p>
              <iframe
                title={video.title}
                width="560"
                height="315"
                src={video.youtube_link}
                frameBorder="0"
                allowFullScreen
              ></iframe>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
export default App;
