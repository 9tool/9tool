import Link from "next/link";

import { ChevronRightIcon, HomeIcon } from "@heroicons/react/20/solid";

export interface Page {
  name: string;
  href?: string;
  current: boolean;
}

export function Breadcrumbs({ pages }: { pages: Page[] }) {
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
              {!!page.href ? (
                <Link
                  href={page.href}
                  className="ml-4 text-sm font-medium text-gray-500 hover:text-gray-700"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </Link>
              ) : (
                <span
                  className="ml-4 select-none text-sm font-medium text-gray-500"
                  aria-current={page.current ? "page" : undefined}
                >
                  {page.name}
                </span>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
}
