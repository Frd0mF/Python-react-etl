export default function Operation({
  item,
  setDraggedItem,
  deleteTransformation,
}) {
  return (
    <button
      draggable={true}
      onDragStart={() => setDraggedItem(item)}
      className="relative cursor-move min-w-max btn"
    >
      {item?.operation}
      <span
        onClick={() => deleteTransformation(item?.id)}
        className="absolute px-1.5 text-base text-red-500 bg-red-100 rounded-full -top-3 -right-1 cursor-pointer"
      >
        X
      </span>
    </button>
  );
}
