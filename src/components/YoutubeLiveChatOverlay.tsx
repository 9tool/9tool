/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { useTransitionCarousel } from "react-spring-carousel";
import type { Overlay, OverlayItem } from "~/server/db";
import { useEffect } from "react";
import type { NextPage } from "next";
import { ChatComponent } from "./ChatComponent";

export const YoutubeLiveChatOverlay: NextPage<{
  overlay: Overlay & { items: OverlayItem[] };
}> = ({ overlay }) => {
  const youtubeId = overlay.metadata.youtubeId;

  if (!youtubeId) {
    return (
      <main className="h-[100svh] w-screen bg-black text-white">
        <p>Youtube ID not found.</p>
      </main>
    );
  }

  return (
    <main className="h-[100svh] w-screen bg-black text-white">
      {youtubeId}

      <ChatComponent youtubeUsername={youtubeId} />
    </main>
  );
};

export function Carousel({ items }: { items: OverlayItem[] }) {
  // eslint-disable-next-line @typescript-eslint/unbound-method
  const { carouselFragment, slideToNextItem } = useTransitionCarousel({
    withLoop: true,

    items: items.map((i) => {
      return {
        id: i.id,
        renderItem: (
          <div
            className="flex h-full w-full items-center justify-center p-8"
            onClick={() => slideToNextItem()}
          >
            {i.type === "IMAGE" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                alt=""
                className="h-full w-full object-contain"
                src={i.value}
              />
            )}
            {i.type === "TEXT" && <span className="text-6xl">{i.value}</span>}
          </div>
        ),
      };
    }),
  });

  useEffect(() => {
    const interval = setInterval(() => {
      slideToNextItem();
    }, 5000);

    return () => clearInterval(interval);
  }, [slideToNextItem]);

  return carouselFragment;
}
