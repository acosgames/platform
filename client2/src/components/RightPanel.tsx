import { useState } from "react";
import { ChatPane } from "./ChatPane";
import { QueueList } from "./QueueList";
import { SignInPane } from "./SignInPane";
import { GamerCard } from "./GamerCard";
import { CompressedGamerCard } from "./CompressedGamerCard";

export function RightPanel() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <div className="w-full h-full min-h-0 flex flex-col gap-3 overflow-hidden">
      {isLoggedIn ? <CompressedGamerCard isOnline={true} /> : <SignInPane onSignIn={() => setIsLoggedIn(true)} />}
      <QueueList />
      {/* <FriendsList /> */}
      <ChatPane />
    </div>
  );
}
