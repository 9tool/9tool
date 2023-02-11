import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../utils/api";
import { isAdmin } from "../../utils/lib";

const Overlays: NextPage = () => {
  const { data: sessionData, status } = useSession();
  const { data: overlays } = api.overlay.getAll.useQuery(undefined, {
    enabled: !isAdmin(sessionData),
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (!isAdmin(sessionData)) {
    return <p>Access Denied</p>;
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <h1>Overlays</h1>
      <ul className="list-disc">
        {overlays &&
          overlays.map((overlay) => {
            return <li key={overlay.id}>{overlay.name}</li>;
          })}
      </ul>
      <Link href="/" className="underline">
        Home
      </Link>
    </main>
  );
};

export default Overlays;
