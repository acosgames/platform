import { useEffect } from "react";

import {
  attachToFrame,
  detachFromFrame,
} from "@/actions/connection";
import { useBucket } from "@/actions/bucket";
import { btLoggedIn } from "@/actions/buckets";
import { reconnect } from "@/actions/ws";

function Connection({}) {
  let loggedIn = useBucket(btLoggedIn);

  useEffect(() => {
    if (loggedIn != "CHECKING") reconnect();
  }, [loggedIn]);

  useEffect(() => {
    attachToFrame();
    return () => {
      detachFromFrame();
    };
  }, []);

  return <></>;
}
export default Connection;
