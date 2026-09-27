import { useEffect } from "react";
import useConversation from "../../zustand/useConversation";
import MessageInput from "./MessageInput";
import Messages from "./Messages";
import { TiMessages } from "react-icons/ti";
import { BiArrowBack } from "react-icons/bi";
import { useAuthContext } from "../../context/AuthContext";

const MessageContainer = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useEffect(() => {
    //cleanup function( unmounting of components)
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);
  return (
    <div className="w-full md:min-w-[450px] flex flex-col h-full">
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          {/* Header */}
          <div className="bg-base-300 px-4 py-2 mb-2 flex items-center gap-2">
            <button 
              className="md:hidden text-base-content opacity-70 hover:opacity-100 cursor-pointer" 
              onClick={() => setSelectedConversation(null)}
            >
              <BiArrowBack className="w-6 h-6" />
            </button>
            <div>
              <span className="label-text">To:</span>{" "}
              <span className="text-base-content font-bold">{selectedConversation.fullName}</span>
            </div>
          </div>

          <Messages />
          <MessageInput />
        </>
      )}
    </div>
  );
};
export default MessageContainer;

const NoChatSelected = () => {
  const {authUser} = useAuthContext();
  return (
    <div className=" flex items-center justify-center w-full h-full">
      <div className=" px-4 text-center sm:text-lg md:text-xl text-base-content font-semibold flex flex-col items-center gap-2">
        <p>Welcome 👋 {authUser.fullName}</p>
        <p>Select a chat to start messaging.</p>
        <TiMessages className=" text-3xl md:text-6xl text-center" />
      </div>
    </div>
  );
};
