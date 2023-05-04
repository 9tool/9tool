import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { api } from "../../utils/api";
import { isAdmin } from "../../utils/lib";
import SidebarLayout from "../../components/layouts/sidebar_layout";
import { useRouter } from "next/router";

const pages: Page[] = [
  { name: "Overlays", href: "/overlays", current: false },
  { name: "Add overlay", href: "/overlays/new", current: true },
];

const NewOverlay: NextPage = () => {
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
          <OverlayForm />
        </div>
      </div>
    </SidebarLayout>
  );
};

export default NewOverlay;

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";
import { useZodForm } from "../../utils/zod-form";
import { overlayCreateSchema } from "~/utils/schemas/overlay";

interface Page {
  name: string;
  href: string;
  current: boolean;
}

function Breadcrumbs({ pages }: { pages: Page[] }) {
  return (
    <nav className="flex" aria-label="Breadcrumb">
      <ol role="list" className="flex items-center space-x-4">
        <li>
          <div>
            <a href="#" className="text-gray-400 hover:text-gray-500">
              <HomeIcon className="h-5 w-5 flex-shrink-0" aria-hidden="true" />
              <span className="sr-only">Home</span>
            </a>
          </div>
        </li>
        {pages.map((page) => (
          <li key={page.name}>
            <div className="flex items-center">
              <ChevronRightIcon
                className="h-5 w-5 flex-shrink-0 text-gray-400"
                aria-hidden="true"
              />
              <Link
                href={page.href}
                className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                aria-current={page.current ? "page" : undefined}
              >
                {page.name}
              </Link>
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}

const OverlayForm = () => {
  const router = useRouter();
  const utils = api.useContext();

  const methods = useZodForm({
    schema: overlayCreateSchema,
  });
  const createOverlay = api.overlay.create.useMutation({
    // mutationFn: async (values) => console.log(values),
    onSettled: () => {
      void utils.overlay.getAll.invalidate();
      methods.reset();
      void router.replace("/overlays");
    },
  });

  const onSubmit = methods.handleSubmit(
    (data) => {
      createOverlay.mutate({
        ...data,
      });
    },
    (e) => {
      console.log("Whoops... something went wrong!");
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
