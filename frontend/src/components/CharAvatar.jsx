import { getInitials } from "../utils/helper";

function CharAvatar({
  username,
  width = "w-10",
  height = "h-10",
  style = "text-base",
}) {
  return (
    <div
      className={`${width || "w-12"} ${height || "h-12"} ${style || ""} flex items-center justify-center rounded-full bg-gray-100 font-medium text-gray-900`}
    >
      {getInitials(username || "")}
    </div>
  );
}

export default CharAvatar;
