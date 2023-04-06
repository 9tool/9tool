import Link from "next/link";
import { OverlayItem } from "@prisma/client";
import { api } from "~/utils/api";

export const OverlayItemComponent = ({ item }: { item: OverlayItem }) => {
  const utils = api.useContext();

  const deleteOverlayItem = api.overlayItem.delete.useMutation({
    onSettled: () => {
      utils.overlay.getOne.invalidate();
    },
  });

  function confirmDeleteOverlayItem(e: MouseEvent, id: string) {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this overlay item?")) {
      deleteOverlayItem.mutate({ id });
    }
  }

  return (
    <tr key={item.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {item.type}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {item.value}
      </td>
      <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {item.updatedAt.toISOString()}
      </td>
      <td className="relative flex gap-4 whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-0">
        <Link
          href={`/overlays/${item.overlayId}/items/${item.id}/edit`}
          className="text-indigo-600 hover:text-indigo-900"
        >
          Edit
        </Link>
        <button
          className="text-red-600 hover:text-red-900"
          onClick={(e) => confirmDeleteOverlayItem(e, item.id)}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
