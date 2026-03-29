import React from "react";

interface YouTubeEmbedProps {
  url: string;
  className?: string;
  title?: string;
}

export default function YouTubeEmbed({ url, className = "", title = "YouTube video player" }: YouTubeEmbedProps) {
  if (!url) return null;

  // Extract Video ID
  const getVideoId = (url: string) => {
    // Handle youtu.be/ID
    const shortMatch = url.match(/youtu\.be\/([^?&]+)/);
    if (shortMatch) return shortMatch[1];
    
    // Handle youtube.com/watch?v=ID
    const watchMatch = url.match(/[?&]v=([^?&]+)/);
    if (watchMatch) return watchMatch[1];
    
    // Handle youtube.com/embed/ID
    const embedMatch = url.match(/embed\/([^?&]+)/);
    if (embedMatch) return embedMatch[1];

    return null;
  };

  const videoId = getVideoId(url);
  if (!videoId) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 text-gray-500 rounded-2xl w-full aspect-video ${className}`}>
        Invalid YouTube URL
      </div>
    );
  }

  const embedUrl = `https://www.youtube.com/embed/${videoId}`;

  return (
    <div className={`relative w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-gray-100 ${className}`}>
      <iframe
        src={embedUrl}
        title={title}
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        allowFullScreen
        className="absolute inset-0 w-full h-full border-0"
        loading="lazy"
      />
    </div>
  );
}
