import { BiLogOut } from "react-icons/bi";
import useLogout from "../hooks/useLogout";

const LogoutButton = () => {
  const { loading, logout } = useLogout();
  return (
    <div>
      {!loading ? (
        <BiLogOut
          className=" w-6 h-6 text-base-content cursor-pointer hover:text-blue-500"
          onClick={logout}
        />
      ) : (
        <span className=" loading loading-spinner"></span>
      )}
    </div>
  );
};

export default LogoutButton;
