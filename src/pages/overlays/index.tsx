import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../utils/api";
import { isAdmin } from "../../utils/lib";
import SidebarLayout from "../../components/layouts/sidebar_layout";
import { useRouter } from "next/router";
import { Overlay } from "@prisma/client";

const Overlays: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession({
    required: true,
    onUnauthenticated() {
      void router.replace("/api/auth/signin");
    },
  });
  const { data: overlays, isLoading } = api.overlay.getAll.useQuery(undefined, {
    // enabled: !isAdmin(sessionData), This makes utils.overlay.invalidate() not working
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
        {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overlays</h1>
        </div>
        <div className="mx-auto my-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        </div> */}

        {(isLoading && <p>Loading...</p>) || (
          <OverlaysTable overlays={overlays ?? []} />
        )}
      </div>
    </SidebarLayout>
  );
};

export default Overlays;

function OverlaysTable({ overlays }: { overlays: Overlay[] }) {
  const utils = api.useContext();

  const deleteOverlay = api.overlay.delete.useMutation({
    onSettled: () => {
      void utils.overlay.getAll.invalidate();
    },
  });

  function confirmDeleteOverlay(id: string) {
    if (confirm("Are you sure you want to delete this overlay?")) {
      deleteOverlay.mutate({ id: id });
    }
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            Overlays
          </h1>
          {/* <p className="mt-2 text-sm text-gray-700">
            A list of all the users in your account including their name, title,
            email and role.
          </p> */}
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
          <Link
            href="/overlays/new"
            className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Add overlay
          </Link>
        </div>
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            <table className="min-w-full divide-y divide-gray-300">
              <thead>
                <tr>
                  <th
                    scope="col"
                    className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-0"
                  >
                    Name
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Key
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Type
                  </th>
                  <th
                    scope="col"
                    className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                  >
                    Updated At
                  </th>
                  <th scope="col" className="relative py-3.5 pl-3 pr-4 sm:pr-0">
                    <span className="sr-only">Edit</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {overlays.map((overlay) => (
                  <tr key={overlay.id}>
                    <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
                      {overlay.name}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {overlay.key}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {overlay.type}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {overlay.updatedAt.toISOString()}
                    </td>
                    <td className="relative flex gap-4 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
                      <Link
                        href={`/overlays/${overlay.id}/view?key=${overlay.key}`}
                        className="text-indigo-600 hover:text-indigo-900"
                        target="_blank"
                      >
                        View <span className="sr-only">, {overlay.name}</span>
                      </Link>
                      <Link
                        href={`/overlays/${overlay.id}/edit`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {overlay.name}</span>
                      </Link>
                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => confirmDeleteOverlay(overlay.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
