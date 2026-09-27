import Sidebar from "../../components/sidebar/Sidebar";
import MessageContainer from "../../components/messages/MessageContainer";
import useConversation from "../../zustand/useConversation";

const Home = () => {
  const { selectedConversation } = useConversation();
  
  return (
    <div className="flex sm:h-[450px] md:h-[550px] rounded-lg overflow-hidden bg-base-200 bg-clip-padding backdrop-filter backdrop-blur-lg bg-opacity-60 border border-base-300 h-[80vh] w-full md:max-w-screen-md">
      <div className={`w-full h-full md:w-80 md:block ${selectedConversation ? 'hidden' : 'block'}`}>
        <Sidebar />
      </div>
      <div className={`w-full h-full md:flex-1 md:block ${selectedConversation ? 'block' : 'hidden'}`}>
        <MessageContainer />
      </div>
    </div>
  );
};

export default Home;
