import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../../utils/api";
import { isAdmin } from "../../../utils/lib";
import SidebarLayout from "../../../components/layouts/sidebar_layout";
import { useRouter } from "next/router";
import { Overlay, OverlayItem } from "@prisma/client";

const ViewOverlayPage: NextPage = () => {
  const router = useRouter();
  const id = router.query.id! as string;
  const key = router.query.key! as string;

  const { data: overlay, status: overlayStatus } =
    api.overlay.getOneByKey.useQuery({ id, key });

  if (overlayStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!overlay) {
    return <p>Overlay Not Found.</p>;
  }

  return (
    <main>
      {overlay && (
        <div className="p-8">
          <h1 className="text-xl">Overlay ID: {overlay.id}</h1>
          <p>Items:</p>
          <ul className="list-disc">
            {overlay.items.map((item) => {
              return <li key={item.id}>{item.value}</li>;
            })}
          </ul>
        </div>
      )}
    </main>
  );
};

export default ViewOverlayPage;
