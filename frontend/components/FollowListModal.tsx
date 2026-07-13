"use client";

type FollowListModalProps = {
  isOpen: boolean;
  onClose: () => void;
  title: "Followers" | "Following";
};

export default function FollowListModal({
  isOpen,
  onClose,
  title,
}: FollowListModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{title}</h2>

          <button
            onClick={onClose}
            className="text-2xl text-gray-500 hover:text-black"
          >
            ×
          </button>
        </div>

        <div className="py-8 text-center text-gray-500">
          Loading...
        </div>
      </div>
    </div>
  );
}