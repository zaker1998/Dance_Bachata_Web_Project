export type VideoLevel = "beginner" | "intermediate" | "advanced";

export interface BachataVideo {
  id: string;
  title: string;
  description: string;
  level: VideoLevel;
  youtubeId: string;
  sourceUrl: string;
}

export const bachataVideos: BachataVideo[] = [
  {
    id: "1",
    title: "(1) Basic Side Step",
    description: "The essential side-to-side step — your very first move in Bachata.",
    level: "beginner",
    youtubeId: "QzNMwbX_qFA",
    sourceUrl: "https://www.youtube.com/watch?v=QzNMwbX_qFA",
  },
  {
    id: "2",
    title: "(2) Forward & Backward Basic Step",
    description: "Expand your footwork with the forward and backward basic pattern.",
    level: "beginner",
    youtubeId: "HJIABcWVvz4",
    sourceUrl: "https://www.youtube.com/watch?v=HJIABcWVvz4",
  },
  {
    id: "3",
    title: "(3) Stationary Basic Step",
    description: "Learn to dance in place — great for tight floors and close connection.",
    level: "beginner",
    youtubeId: "wdljjdJjahs",
    sourceUrl: "https://www.youtube.com/watch?v=wdljjdJjahs",
  },
  {
    id: "4",
    title: "(4) Ladies Underarm Turn",
    description: "Your first turn — a clean underarm turn to the right for followers.",
    level: "beginner",
    youtubeId: "8emyDe-zOaI",
    sourceUrl: "https://www.youtube.com/watch?v=8emyDe-zOaI",
  },
  {
    id: "5",
    title: "(5) Bachata Beginner Combo I",
    description: "Put the first three basics together into a simple flowing combination.",
    level: "beginner",
    youtubeId: "RQYmfSF8B4c",
    sourceUrl: "https://www.youtube.com/watch?v=RQYmfSF8B4c",
  },
  {
    id: "6",
    title: "(6) Bachata Beginner Combo II",
    description: "Build on the combo with five moves linked together — your first mini routine.",
    level: "beginner",
    youtubeId: "WxrOHzeqLZ0",
    sourceUrl: "https://www.youtube.com/watch?v=WxrOHzeqLZ0",
  },
];
