import versions from 'shared/model/versions.json';

import { useEffect } from "react";
import { useBucket } from "@/actions/bucket";
import { btVersion } from "@/actions/buckets";
import { showToast } from "@/actions/toast";

function VersionControl() {
  const version = useBucket(btVersion);

  useEffect(() => {
    const clientVersion = Number(versions?.client?.version || 1);
    const serverVersion = Number(version || 0);

    if (clientVersion < serverVersion) {
      showToast({
        title: "Update available",
        description: "A new version is available, reload the page to update.",
        status: "warning",
        duration: 30000,
        isClosable: true,
      });

      localStorage.setItem("clientVersion", String(serverVersion));
    }
  }, [version]);

  return <></>;
}

export default VersionControl;
