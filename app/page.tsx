"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Heart, Users, Globe, Sparkles } from "lucide-react";

const VIDEO_ID = "VCWtj6-q8_E";
const START_SEC = 168; // 2:48
const END_SEC = 307;   // 5:07

const benefits = [
  {
    icon: Heart,
    title: "Pure Joy",
    description:
      "Bachata is raw emotion set to music. Every class leaves you smiling — it is physically impossible not to.",
  },
  {
    icon: Users,
    title: "Instant Community",
    description:
      "Walk into any Bachata social anywhere in the world and you already have a hundred new friends waiting.",
  },
  {
    icon: Globe,
    title: "A Passport to the World",
    description:
      "Danced in 100+ countries, Bachata turns any city into familiar territory. Your skills travel with you.",
  },
  {
    icon: Sparkles,
    title: "Real Confidence",
    description:
      "Learning to move your body changes how you carry yourself — on the dance floor and everywhere else.",
  },
];

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const playerRef = useRef<any>(null);
  const [videoPlaying, setVideoPlaying] = useState(false);

  useEffect(() => {
    const initPlayer = () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      playerRef.current = new (window as any).YT.Player("yt-bg-player", {
        videoId: VIDEO_ID,
        playerVars: {
          autoplay: 1,
          mute: 1,
          controls: 0,
          showinfo: 0,
          rel: 0,
          modestbranding: 1,
          playsinline: 1,
          start: START_SEC,
          end: END_SEC,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onStateChange: (event: { data: number }) => {
            if (event.data === 1) setVideoPlaying(true);
            if (event.data === 0) {
              playerRef.current?.seekTo(START_SEC, true);
              playerRef.current?.playVideo();
            }
          },
        },
      });
    };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (window as any).onYouTubeIframeAPIReady = initPlayer;
      if (!document.querySelector('script[src="https://www.youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      playerRef.current?.destroy();
    };
  }, []);

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden">
        {/* Blurred thumbnail — fades out once the video starts playing */}
        <div
          className={`pointer-events-none absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ${
            videoPlaying ? "opacity-0" : "opacity-100"
          }`}
          style={{
            backgroundImage: `url(https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
            filter: "blur(12px)",
            transform: "scale(1.08)",
          }}
        />

        {/* YouTube iframe (IFrame API replaces the div) */}
        <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
          <div id="yt-bg-player" />
        </div>

        {/* Dark overlay */}
        <div className="pointer-events-none absolute inset-0 bg-black/55" />

        {/* Attribution */}
        <a
          href={`https://www.youtube.com/watch?v=${VIDEO_ID}`}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-3 right-4 z-10 text-xs text-white/40 transition-colors hover:text-white/70"
        >
          Video source (not me in the video) ↗
        </a>

        <div className="relative z-10 mx-auto max-w-3xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 text-sm font-semibold uppercase tracking-widest text-primary"
          >
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl md:text-6xl"
          >
            Master Bachata
            <br />
            <span className="text-primary">in Vienna</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mx-auto mt-6 max-w-xl text-lg text-white/80"
          >
            From first steps to advanced combinations — join our group classes,
            book a private session, or learn at your own pace with video library.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          >
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/book">Book Now</Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/70 text-white hover:bg-white/10 hover:text-white"
            >
              <Link href="/videos">Browse Videos</Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* ── Bachata Story ── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-3xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            The Dance
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            Born in the Dominican Republic.
            <br />
            <span className="text-primary">Loved by the world.</span>
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 space-y-5 text-left text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              Bachata was born in the early 1960s in the poor neighborhoods of
              the Dominican Republic. For decades it was dismissed as{" "}
              <em>música de amargue</em> — music of bitterness — too raw, too
              working-class to be played on the radio. It was banned. Looked
              down upon. Almost forgotten.
            </p>
            <p>
              It survived anyway. Because when music speaks directly to the
              heart, no amount of gatekeeping can silence it.
            </p>
            <p>
              Today Bachata is danced on every continent — from open-air
              festivals in Barcelona to rooftop socials in Tokyo. It has evolved
              into something extraordinary: a conversation between two people,
              told through movement, built on trust, carried by music that makes
              you feel everything at once.
            </p>
          </motion.div>

          <motion.blockquote
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-12 border-l-4 border-primary pl-6 text-left italic text-muted-foreground"
          >
            &ldquo;A music that was once forbidden is now the language that
            connects millions of people who never shared a single word.&rdquo;
          </motion.blockquote>
        </div>
      </section>

      {/* ── Benefits ── */}
      <section className="bg-foreground py-24">
        <div className="mx-auto max-w-5xl px-4">
          <div className="text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary">
              What You Gain
            </p>
            <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
              More than just a dance
            </h2>
          </div>

          <div className="mt-14 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((b, i) => (
              <motion.div
                key={b.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                className="flex flex-col items-center text-center"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/20">
                  <b.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="mb-2 text-lg font-bold text-white">{b.title}</h3>
                <p className="text-sm leading-relaxed text-white/60">
                  {b.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── "Just Try It" CTA ── */}
      <section className="bg-background py-24">
        <div className="mx-auto max-w-2xl px-4 text-center">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="mb-3 text-sm font-semibold uppercase tracking-widest text-primary"
          >
            Just Try It
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-3xl font-extrabold tracking-tight sm:text-4xl"
          >
            One class. That&apos;s all it takes.
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-8 space-y-5 text-lg leading-relaxed text-muted-foreground"
          >
            <p>
              You don&apos;t need rhythm. You don&apos;t need a partner. You
              don&apos;t need to feel &ldquo;ready.&rdquo; You just need to show
              up once — and let the music do the rest.
            </p>
            <p>
              People who try Bachata rarely stop. Not because they have to. But
              because it becomes the best part of their week — the place where
              stress melts, strangers become lifelong friends, and you remember
              that your body was built for far more than sitting at a desk.
            </p>
            <p>
              You&apos;ll leave your first class with a smile you can&apos;t
              explain, the number of at least three new people in your phone,
              and a very strong urge to come back next week.
            </p>
            <p className="text-xl font-semibold text-foreground">
              Try it. We 100% guarantee you will not regret it.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-10"
          >
            <Button asChild size="lg" className="shadow-lg">
              <Link href="/book">Book Your First Class</Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </>
  );
}
