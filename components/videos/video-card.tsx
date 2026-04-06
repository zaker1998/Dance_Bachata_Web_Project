import type { BachataVideo, VideoLevel } from "@/lib/data";
import { cn } from "@/lib/utils";

const levelStyles: Record<VideoLevel, string> = {
  beginner: "bg-emerald-100 text-emerald-700",
  intermediate: "bg-amber-100 text-amber-700",
  advanced: "bg-rose-100 text-rose-700",
};

interface VideoCardProps {
  video: BachataVideo;
}

export function VideoCard({ video }: VideoCardProps) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl border border-border bg-white shadow-sm transition-shadow hover:shadow-md">
      <div className="relative aspect-video w-full bg-muted">
        <iframe
          src={`https://www.youtube.com/embed/${video.youtubeId}`}
          title={video.title}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 h-full w-full"
          loading="lazy"
        />
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-base font-semibold leading-snug">{video.title}</h3>
          <span
            className={cn(
              "shrink-0 rounded-full px-2.5 py-0.5 text-xs font-medium capitalize",
              levelStyles[video.level]
            )}
          >
            {video.level}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">{video.description}</p>
      </div>
    </article>
  );
}
