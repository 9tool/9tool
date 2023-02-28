import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../utils/api";
import { isAdmin } from "../../utils/lib";
import SidebarLayout from "../../components/layouts/sidebar_layout";
import { useRouter } from "next/router";

const Overlays: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.replace("/api/auth/signin");
    },
  });
  const { data: overlays } = api.overlay.getAll.useQuery(undefined, {
    enabled: !isAdmin(sessionData),
  });

  if (status === "loading") {
    return <p>Loading...</p>;
  }

  if (!isAdmin(sessionData)) {
    return <p>Access Denied</p>;
  }

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overlays</h1>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ul className="list-disc">
            {overlays &&
              overlays.map((overlay) => {
                return (
                  <li key={overlay.id}>
                    <Link
                      href={`/overlays/${overlay.id}`}
                      className="underline"
                    >
                      {overlay.name}
                    </Link>
                  </li>
                );
              })}
          </ul>
        </div>
      </div>
    </SidebarLayout>
  );
};

export default Overlays;
