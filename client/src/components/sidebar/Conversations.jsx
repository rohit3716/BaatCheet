import { getRandomEmoji } from "../../utils/emojis";
import useGetConversations from "../hooks/useGetConversations";
import Conversation from "./Conversation";

const Conversations = ({ search }) => {
  const { loading, conversations } = useGetConversations();
  
  const filteredConversations = search 
    ? conversations.filter(c => c.fullName.toLowerCase().includes(search.toLowerCase()))
    : conversations;

  return (
    <div className="py-2 flex flex-col overflow-auto flex-1">
      {filteredConversations.map((conversation, idx) => (
        <Conversation
          key={conversation._id}
          conversation={conversation}
          emoji={getRandomEmoji()}
          lastIdx={idx === filteredConversations.length - 1}
        />
      ))}
      {loading ? (
        <span className=" loading loading-spinner mx-auto"></span>
      ) : null}
      {!loading && filteredConversations.length === 0 ? (
        <p className="text-center text-base-content opacity-70 mt-4">No users found</p>
      ) : null}
    </div>
  );
};
export default Conversations;
