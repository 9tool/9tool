import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "~/utils/api";
import { isAdmin } from "~/utils/lib";
import SidebarLayout from "~/components/layouts/sidebar_layout";
import { useRouter } from "next/router";

const pages: Page[] = [
  { name: "Overlays", href: "/overlays", current: false },
  { name: "Edit overlay", current: true },
];

const EditOverlayItem: NextPage = () => {
  const router = useRouter();
  const { data: sessionData, status } = useSession({
    required: true,
    async onUnauthenticated() {
      await router.replace("/api/auth/signin");
    },
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
        <div className="px-6">
          <Breadcrumbs pages={pages} />
        </div>
        {/* <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">Overlays</h1>
        </div>
        <div className="mx-auto my-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        </div> */}
        <div className="mt-6 px-6">
          <OverlayItemForm />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default EditOverlayItem;

import { z } from "zod";
import { useZodForm } from "~/utils/zod-form";
import type { Page } from "~/components/Breadcrumbs";
import { Breadcrumbs } from "~/components/Breadcrumbs";

export const overlayItemSchema = z.object({
  type: z.enum(["TEXT", "IMAGE"]),
  value: z.string(),
});

const OverlayItemForm = () => {
  const router = useRouter();
  const utils = api.useContext();
  const id = router.query.itemId! as string;

  const { data: overlayItem } = api.overlayItem.getOne.useQuery(
    { id },
    {
      enabled: !!id,
    }
  );

  const methods = useZodForm({
    schema: overlayItemSchema,
    values: {
      ...overlayItem!,
    },
  });
  const updateOverlayItem = api.overlayItem.update.useMutation({
    onSettled: () => {
      void utils.overlay.getAll.invalidate();
      methods.reset();
      void router.replace(`/overlays/${router.query.id! as string}/edit`);
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      updateOverlayItem.mutate({
        ...data,
        id: router.query.itemId as string,
      });
    },
    (e) => {
      console.log("Whoops... something went wrong!");
      console.error(e);
    }
  );

  const typeValue = methods.watch("type");

  return (
    <form className="space-y-8 divide-y divide-gray-200" onSubmit={onSubmit}>
      <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
        <div className="space-y-6 sm:space-y-5">
          <div>
            <h3 className="text-base font-semibold leading-6 text-gray-900">
              Overlay item information
            </h3>
            {/* <p className="mt-1 max-w-2xl text-sm text-gray-500">
              This information will be displayed publicly so be careful what you
              share.
            </p> */}
          </div>
          <div className="space-y-6 sm:space-y-5">
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="type"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Type
              </label>
              <div className="mt-2 sm:col-span-2 sm:mt-0">
                <select
                  id="type"
                  className="block w-full max-w-lg rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
                  {...methods.register("type", { required: true })}
                >
                  <option value="TEXT">Text</option>
                  <option value="IMAGE">Image</option>
                </select>
              </div>
            </div>
            <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:border-t sm:border-gray-200 sm:pt-5">
              <label
                htmlFor="value"
                className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"
              >
                Value
              </label>
              <div className="mt-1 sm:col-span-2 sm:mt-0">
                <textarea
                  required
                  {...methods.register("value")}
                  className="block w-full max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
                  placeholder="Value"
                />
                {typeValue === "IMAGE" && (
                  <div className="mt-1 sm:col-span-2">
                    <p className="text-sm text-gray-500">Enter image URL</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-5">
        <div className="flex justify-end">
          <Link
            href={`/overlays/${router.query.id! as string}/edit`}
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
