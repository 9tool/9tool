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

  function confirmDeleteOverlayItem(
    e: React.MouseEvent<HTMLButtonElement>
  ): void {
    e.preventDefault();
    if (confirm("Are you sure you want to delete this overlay item?")) {
      deleteOverlayItem.mutate({ id: item.id });
    }
  }

  return (
    <tr key={item.id}>
      <td className="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-0">
        {item.type}
      </td>
      <td className="flex items-center gap-4 whitespace-nowrap px-3 py-4 text-sm text-gray-500">
        {item.value}
        {/* If type is IMAGE, preview the value as image */}
        {item.type === "IMAGE" && (
          <span className="flex h-20 w-20 items-center bg-black p-2">
            <img className="" src={item.value} />
          </span>
        )}
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
          onClick={confirmDeleteOverlayItem}
        >
          Delete
        </button>
      </td>
    </tr>
  );
};
