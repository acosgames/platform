import { useLayoutEffect } from "react";
import { getUser } from "@/actions/person";

function ActivateUserProfile() {
    useLayoutEffect(() => {
        getUser();
    }, []);
    return <></>;
}

export default ActivateUserProfile;
