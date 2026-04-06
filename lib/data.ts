export type VideoLevel = "beginner" | "intermediate" | "advanced";

export interface BachataVideo {
  id: string;
  title: string;
  description: string;
  level: VideoLevel;
  youtubeId: string;
}

export const bachataVideos: BachataVideo[] = [
  {
    id: "1",
    title: "Bachata Basics: Steps & Timing",
    description:
      "Learn the fundamental 4-count side step, weight shifts, and how to find the beat in any Bachata song.",
    level: "beginner",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "2",
    title: "Partner Connection & Frame",
    description:
      "Build a comfortable closed hold, understand lead and follow communication, and stay on time with your partner.",
    level: "beginner",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "3",
    title: "Turns & Body Rolls",
    description:
      "Add flair with single-hand turns, body waves, and smooth hip styling for both leader and follower.",
    level: "intermediate",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "4",
    title: "Musicality & Sensual Pauses",
    description:
      "Interpret the music's breaks and melodies through deliberate pauses, isolations, and expressive movement.",
    level: "intermediate",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "5",
    title: "Dominican Footwork Patterns",
    description:
      "Explore traditional Dominican-style Bachata footwork — faster, grounded, and rhythmically playful.",
    level: "intermediate",
    youtubeId: "dQw4w9WgXcQ",
  },
  {
    id: "6",
    title: "Advanced Dips & Combinations",
    description:
      "Combine turns, dips, and cross-body patterns into polished sequences for the social dance floor.",
    level: "advanced",
    youtubeId: "dQw4w9WgXcQ",
  },
];
