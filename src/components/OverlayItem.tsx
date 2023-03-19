import Link from "next/link";
import { OverlayItem } from "@prisma/client";

export const OverlayItemComponent = ({ item }: { item: OverlayItem }) => {
  return (
    <tr key={item.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {item.type}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {item.value}
      </td>
      <td className="whitespace-nowrap py-4 px-3 text-sm text-gray-500">
        {item.updatedAt.toISOString()}
      </td>
      <td className="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        {/* <Link
          href={`/items/${item.id}/edit`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </Link> */}
      </td>
    </tr>
  );
};
