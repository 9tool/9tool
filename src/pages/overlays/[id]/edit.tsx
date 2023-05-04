import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../../utils/api";
import { isAdmin } from "../../../utils/lib";
import SidebarLayout from "../../../components/layouts/sidebar_layout";
import { useRouter } from "next/router";
import type { Overlay, OverlayItem } from "@prisma/client";

const pages: Page[] = [{ name: "Overlays", href: "/overlays", current: false }];

const NewOverlay: NextPage = () => {
  const router = useRouter();
  const id = router.query.id! as string;

  const { data: sessionData, status } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.replace("/api/auth/signin");
    },
  });

  const { data: overlay, status: overlayStatus } = api.overlay.getOne.useQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  if (status === "loading" || overlayStatus === "loading") {
    return <p>Loading...</p>;
  }

  if (!isAdmin(sessionData)) {
    return <p>Access Denied</p>;
  }

  return (
    <SidebarLayout>
      <div className="py-6">
        <div className="px-6">
          <Breadcrumbs
            pages={[
              ...pages,
              {
                name: "Edit overlay",
                href: `/overlays/${router.query.id as string}/edit`,
                current: true,
              },
            ]}
          />
        </div>
        {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overlays</h1>
        </div>
        <div className="mx-auto my-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        </div> */}
        <div className="mt-6 px-6">
          {(overlay && <OverlayForm overlay={overlay} />) || (
            <p>Overlay Not Found.</p>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
};

export default NewOverlay;

import { useZodForm } from "../../../utils/zod-form";
import { OverlayItemComponent } from "../../../components/OverlayItem";
import type { Page } from "~/components/Breadcrumbs";
import { Breadcrumbs } from "~/components/Breadcrumbs";
import { overlayCreateSchema } from "~/utils/schemas/overlay";

const OverlayForm = ({
  overlay,
}: {
  overlay: Overlay & { items: OverlayItem[] };
}) => {
  const router = useRouter();

  const id = router.query.id! as string;
  const utils = api.useContext();

  const methods = useZodForm({
    schema: overlayCreateSchema,
    values: {
      ...overlay,
      metadata: JSON.stringify(overlay.metadata),
    },
  });

  const updateOverlay = api.overlay.update.useMutation({
    // mutationFn: async (values) => console.log(values),
    onSettled: () => {
      void utils.overlay.getAll.invalidate();
      methods.reset();
      void router.replace("/overlays");
    },
    onError: (e) => {
      console.error(e);
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      updateOverlay.mutate({
        ...data,
        id,
      });
    },
    (e) => {
      console.error(e);
    }
  );

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Overlay information
            </h3>
            {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information will be displayed publicly so be careful what you
              share.
            </p> */}
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Name
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <input
                  required
                  type="text"
                  {...methods.register("name")}
                  className="block w-full max-w-lg rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:max-w-xs sm:text-sm"
                  placeholder="Overlay name"
                />
                {methods.formState.errors.name?.message && (
                  <p className="text-red-700">
                    {methods.formState.errors.name?.message}
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="type"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Type
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <select
                  id="type"
                  className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  {...methods.register("type", { required: true })}
                >
                  <option value="SLIDES">Slides</option>
                  <option value="YOUTUBE_LIVE_CHAT">Youtube Live Chat</option>
                </select>
              </div>
            </div>
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="metadata"
                className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
              >
                Metadata
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  id="metadata"
                  className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  {...methods.register("metadata", { required: true })}
                ></textarea>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="mt-8 space-y-6 sm:space-y-5">
          <div className="sm:flex sm:items-center">
            <h3 className="text-base font-semibold leading-6 text-gray-900 sm:flex-auto">
              Overlay Items
            </h3>
            <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
              <Link
                href={`/overlays/${id}/items/new`}
                className="block rounded-md bg-indigo-600 px-3 py-1.5 text-center text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Add Item
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
                        Type
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Value
                      </th>
                      <th
                        scope="col"
                        className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                      >
                        Updated At
                      </th>
                      <th
                        scope="col"
                        className="relative py-3.5 pl-3 pr-4 sm:pr-0"
                      >
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {overlay.items.map((item) => (
                      <OverlayItemComponent item={item} key={item.id} />
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Link
            href="/overlays"
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </Link>
          <button
            type="submit"
            className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Save
          </button>
        </div>
      </div>
    </form>
  );
};
