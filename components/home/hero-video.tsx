"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type YTPlayer = {
  destroy: () => void;
  seekTo: (seconds: number, allowSeekAhead?: boolean) => void;
  playVideo: () => void;
};

type YTNamespace = {
  Player: new (
    elementId: string,
    options: Record<string, unknown>
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

interface HeroVideoProps {
  videoId: string;
  startSec: number;
  endSec: number;
}

/**
 * Looping, muted YouTube background. Uses youtube-nocookie host so the player
 * doesn't set tracking cookies before user interaction. Respects
 * `prefers-reduced-motion` by skipping autoplay entirely.
 */
export function HeroVideo({ videoId, startSec, endSec }: HeroVideoProps) {
  const playerRef = useRef<YTPlayer | null>(null);
  const [playing, setPlaying] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;

    const initPlayer = () => {
      if (!window.YT?.Player) return;
      playerRef.current = new window.YT.Player("yt-bg-player", {
        videoId,
        host: "https://www.youtube-nocookie.com",
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: startSec,
          end: endSec,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === 1) setPlaying(true);
            if (event.data === 0) {
              playerRef.current?.seekTo(startSec, true);
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    if (window.YT?.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
      if (
        !document.querySelector('script[src="https://www.youtube.com/iframe_api"]')
      ) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy();
      playerRef.current = null;
    };
  }, [videoId, startSec, endSec, prefersReducedMotion]);

  return (
    <div aria-hidden="true">
      <div
        className={`pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
          playing ? "opacity-0" : "opacity-100"
        }`}
        style={{
          backgroundImage: `url(https://img.youtube.com/vi/${videoId}/maxresdefault.jpg)`,
          filter: "blur(12px)",
          transform: "scale(1.08)",
        }}
      />
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div id="yt-bg-player" />
      </div>
    </div>
  );
}
