import Spinner from "./Spinner";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-white">
      <Spinner sizeClassName="h-12 w-12" />
    </div>
  );
}