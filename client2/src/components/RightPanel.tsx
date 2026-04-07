
import { QueueList } from "./QueueList";
import { SignInPane } from "./SignInPane";
// import { GamerCard } from "./GamerCard";
import { CompressedGamerCard } from "./CompressedGamerCard";
import {  btLoggedIn } from "@/actions/buckets";
import { useBucket } from "@/actions/bucket";
// import { isUserLoggedIn } from "@/actions/person";

export function RightPanel() {

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-0 overflow-hidden">
      <ShowLoginOrGamerCard />
      <QueueList />
      {/* <FriendsList /> */}
      {/* <ChatPane /> */}
    </div>
  );
}

// let renderCount = 0;
function ShowLoginOrGamerCard() {
    // const [isLoggedIn, setIsLoggedIn] = useState(false);
    let loggedIn = useBucket(btLoggedIn);
    // let [loggedIn, player, latency, wsConnected, duplicatetabs] = useBuckets([btLoggedIn, btUser, btLatency, btWebsocketConnected, btDuplicateTabs]);

    // console.log("Render Count:", ++renderCount, { loggedIn, player, latency, wsConnected, duplicatetabs });
    if( (!loggedIn || loggedIn == "LURKER" || loggedIn == "CHECKING") ) {
      return <SignInPane onSignIn={() => false} />
    }

    // if( player ) {
      return <CompressedGamerCard  />;
    // }
    
    // return <></>
}
