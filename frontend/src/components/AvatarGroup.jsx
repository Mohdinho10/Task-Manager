import { BASE_URL } from "../constants";
import { getInitials } from "../utils/helper";

function AvatarGroup({ avatars, maxVisible }) {
  return (
    <div className="flex items-center">
      {avatars.slice(0, maxVisible).map((avatar, index) => (
        <div key={index} className="group relative -ml-3 first:ml-0">
          {avatar.profileImageUrl ? (
            <img
              src={`${BASE_URL}${avatar.profileImageUrl.replace("public", "")}`}
              alt={avatar.name}
              className="h-9 w-9 rounded-full border-2 border-white object-cover"
            />
          ) : (
            <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-gray-300 text-sm font-semibold text-gray-700">
              {getInitials(avatar.name)}
            </div>
          )}

          {/* Tooltip */}
          <div className="bg-primary pointer-events-none absolute -top-9 left-1/2 z-10 -translate-x-1/2 rounded px-2 py-1 text-[10px] whitespace-nowrap text-white opacity-0 transition group-hover:opacity-100">
            {avatar.name}
          </div>
        </div>
      ))}

      {avatars.length > maxVisible && (
        <div className="-ml-3 flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-blue-50 text-sm font-medium">
          +{avatars.length - maxVisible}
        </div>
      )}
    </div>
  );
}

export default AvatarGroup;
