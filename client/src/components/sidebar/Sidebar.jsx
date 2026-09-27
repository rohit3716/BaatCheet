import Conversations from "./Conversations";
import LogoutButton from "./LogoutButton";
import SearchInput from "./SearchInput";
import { useState } from "react";
import ProfileModal from "./ProfileModal";
import { BiCog } from "react-icons/bi";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
	const [showProfile, setShowProfile] = useState(false);
	const [search, setSearch] = useState("");

	return (
		<div className='border-r border-slate-500 p-4 flex flex-col h-full'>
			<SearchInput search={search} setSearch={setSearch} />
			<div className='divider px-3'></div>
			<Conversations search={search} />
			<div className="mt-auto flex justify-between items-center pt-4">
				<LogoutButton />
				<ThemeToggle />
				<button onClick={() => setShowProfile(true)} className="text-base-content cursor-pointer hover:text-blue-500 transition-colors">
					<BiCog className="w-6 h-6 text-base-content hover:text-blue-500" />
				</button>
			</div>
			{showProfile && <ProfileModal onClose={() => setShowProfile(false)} />}
		</div>
	);
};
export default Sidebar;