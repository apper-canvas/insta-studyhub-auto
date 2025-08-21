const Loading = ({ className = "" }) => {
  return (
    <div className={`animate-pulse space-y-4 ${className}`}>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="card p-6">
            <div className="flex items-center space-x-4">
              <div className="w-4 h-4 bg-surface-300 rounded"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-surface-300 rounded w-3/4"></div>
                <div className="h-3 bg-surface-300 rounded w-1/2"></div>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              <div className="h-2 bg-surface-300 rounded"></div>
              <div className="h-4 bg-surface-300 rounded w-1/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Loading;