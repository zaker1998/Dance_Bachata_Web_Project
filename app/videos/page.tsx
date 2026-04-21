import type { Metadata } from "next";
import { bachataVideos } from "@/lib/data";
import { VideoCard } from "@/components/videos/video-card";

export const metadata: Metadata = {
  title: "Video Library — Bachata Vienna",
  description: "Browse our Bachata class recordings across all levels.",
  alternates: { canonical: "/videos" },
  openGraph: {
    title: "Video Library — Bachata Vienna",
    description: "Browse our Bachata class recordings across all levels.",
    url: "/videos",
    type: "website",
  },
};

export default function VideosPage() {
  return (
    <div className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-10">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Video Library
        </h1>
        <p className="mt-2 text-muted-foreground">
          Learn at your own pace — filter by level and dive in.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {bachataVideos.map((video) => (
          <VideoCard key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
}
