import { NextPage } from "next";
import { useSession } from "next-auth/react";
import Error from "next/error";
import { useRouter } from "next/router";
import { api } from "../../utils/api";
import { isAdmin } from "../../utils/lib";

const Overlay: NextPage = () => {
  const router = useRouter();
  const id = router.query.id! as string;

  const { data: sessionData, status: sessionStatus } = useSession();
  const { data: overlay, status: overlayStatus } = api.overlay.getOne.useQuery(
    { id },
    {
      enabled: !isAdmin(sessionData),
    }
  );

  if (sessionStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (sessionStatus === "unauthenticated") {
    return <Error statusCode={401} />;
  }

  if (!isAdmin(sessionData)) {
    return <Error statusCode={401} />;
  }

  if (overlayStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!overlay) {
    return <Error statusCode={404} />;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>
        Overlay
        <span className="ml-2 rounded bg-white/10 p-2">{overlay.name}</span>
      </h1>
    </main>
  );
};

export default Overlay;
