import { type NextPage } from "next";
import { api } from "../../../utils/api";
import { useRouter } from "next/router";
import { SlidesOverlay } from "~/components/SlidesOverlay";
import { YoutubeLiveChatOverlay } from "~/components/YoutubeLiveChatOverlay";

const ViewOverlayPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id! as string;
  const key = router.query.key! as string;

  const { data: overlay, status: overlayStatus } =
    api.overlay.getOneByKey.useQuery({ id, key }, { enabled: !!id && !!key });

  if (overlayStatus === "loading") {
    return (
      <main className="flex h-[100svh] w-full items-center justify-center bg-black text-6xl text-white">
        <p>Loading...</p>
      </main>
    );
  }

  if (!overlay) {
    return (
      <main className="flex h-[100svh] w-full items-center justify-center bg-black text-6xl text-white">
        <p>Overlay Not Found.</p>
      </main>
    );
  }

  if (overlay.type === "SLIDES") {
    return <SlidesOverlay overlay={overlay} />;
  } else if (overlay.type === "YOUTUBE_LIVE_CHAT") {
    return <YoutubeLiveChatOverlay overlay={overlay} />;
  } else {
    return (
      <main className="flex h-[100svh] w-full items-center justify-center bg-black text-6xl text-white">
        <p>Overlay Type Not Supported.</p>
      </main>
    );
  }
};

export default ViewOverlayPage;
