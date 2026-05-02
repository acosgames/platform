import React, { useState, useLayoutEffect } from "react";
import { getUser } from "@/actions/person";

function ActivateUserProfile({ children }: { children: React.ReactNode }) {
    const [ready, setReady] = useState(false);

    useLayoutEffect(() => {
        getUser().finally(() => setReady(true));
    }, []);

    if (!ready) {
        return (
            <div className="flex h-screen items-center justify-center bg-background">
                <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
            </div>
        );
    }

    return <>{children}</>;
}

export default ActivateUserProfile;
