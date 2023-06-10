import { useTransitionCarousel } from "react-spring-carousel";
import type { Overlay, OverlayItem } from "@prisma/client";
import { useEffect } from "react";
import type { NextPage } from "next";

export const SlidesOverlay: NextPage<{
  overlay: Overlay & { items: OverlayItem[] };
}> = ({ overlay }) => {
  if (overlay && !overlay.items.length) {
    return (
      <main className="flex h-[100svh] w-full items-center justify-center bg-black text-6xl text-white">
        <p>No overlay items, please add at least one item</p>
      </main>
    );
  }

  return (
    <main className="h-[100svh] w-screen bg-black text-white">
      {overlay && <Carousel items={[...overlay.items]} />}
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
