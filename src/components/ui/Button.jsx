const Button = ({ children, onClick, type = "primary" }) => {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded ${
        type === "primary" ? "bg-blue-500 text-white" : "bg-gray-200"
      }`}
    >
      {children}
    </button>
  );
};

export default Button;