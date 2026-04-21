const EmptyState = ({ message }) => {
  return (
    <div className="text-center p-6 text-gray-500">
      {message || "No data available"}
    </div>
  );
};

export default EmptyState;