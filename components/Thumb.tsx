
function Thumb({ src, name }: { src?: string; name: string }) {
  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className="h-11 w-11 rounded-lg object-cover ring-1 ring-border"
      />
    );
  }
  const initial = name.trim().charAt(0).toUpperCase() || "?";
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-gradient-to-br from-[#f77f00]/20 to-[#f77f00]/5 text-sm font-bold text-[#f77f00] ring-1 ring-border">
      {initial}
    </div>
  );
}

export default Thumb