export default function FancySpinner() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="relative">
        <div className="animate-spin rounded-full h-32 w-32 border-t-4 border-purple-500"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="text-purple-500 text-center font-semibold rounded-full px-4 py-2">
            Fetching Results
          </span>
        </div>
      </div>
    </div>
  );
}
