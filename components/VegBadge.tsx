export default function VegBadge({ isVeg }: { isVeg: boolean }) {
  return (
    <span
      className={`inline-flex items-center justify-center w-4 h-4 border-2 rounded-sm ${isVeg ? "border-veg" : "border-non-veg"}`}
    >
      <span
        className={`w-2 h-2 rounded-full ${isVeg ? "bg-veg" : "bg-non-veg"}`}
      />
    </span>
  );
}
