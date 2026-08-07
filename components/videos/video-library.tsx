"use client";

import { useState } from "react";
import type { BachataVideo, VideoLevel } from "@/lib/data";
import { VideoCard } from "@/components/videos/video-card";
import { cn } from "@/lib/utils";

const LEVELS: VideoLevel[] = ["beginner", "intermediate", "advanced"];

interface VideoLibraryProps {
  videos: BachataVideo[];
}

export function VideoLibrary({ videos }: VideoLibraryProps) {
  const [level, setLevel] = useState<VideoLevel | "all">("all");

  const availableLevels = LEVELS.filter((l) => videos.some((v) => v.level === l));
  const filtered = level === "all" ? videos : videos.filter((v) => v.level === level);

  return (
    <div>
      <div
        role="group"
        aria-label="Filter videos by level"
        className="mb-8 flex flex-wrap gap-2"
      >
        {(["all", ...availableLevels] as const).map((l) => {
          const count = l === "all" ? videos.length : videos.filter((v) => v.level === l).length;
          const active = level === l;
          return (
            <button
              key={l}
              type="button"
              onClick={() => setLevel(l)}
              aria-pressed={active}
              className={cn(
                "rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
                active
                  ? "border-primary bg-primary text-white"
                  : "border-border bg-white text-muted-foreground hover:border-primary/40 hover:text-foreground"
              )}
            >
              {l === "all" ? "All levels" : l}
              <span className={cn("ml-1.5 text-xs", active ? "text-white/80" : "text-muted-foreground/60")}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-border bg-muted/30 px-6 py-12 text-center text-muted-foreground">
          No videos at this level yet — check back soon.
        </p>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((video) => (
            <VideoCard key={video.id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}
