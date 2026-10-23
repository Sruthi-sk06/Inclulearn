export default function DeafToolbar() {
  return (
    <div
      className="bg-green-800 text-white px-4 py-3 flex flex-wrap gap-3 items-center"
      role="toolbar"
      aria-label="Accessibility toolbar for deaf users"
    >
      <span className="text-green-300 font-bold text-sm">👂 Deaf Mode Active</span>
      <div className="flex gap-2 flex-wrap">
        <span className="bg-green-700 px-3 py-1 rounded-lg text-xs">✅ Captions ON</span>
        <span className="bg-green-700 px-3 py-1 rounded-lg text-xs">✅ Visual alerts ON</span>
        <span className="bg-green-700 px-3 py-1 rounded-lg text-xs">✅ No audio dependency</span>
      </div>
      <p className="text-green-200 text-xs w-full">
        All content is available as text. Alerts are visual. Videos include captions.
      </p>
    </div>
  );
}