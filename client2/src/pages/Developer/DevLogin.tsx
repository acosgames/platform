import { useEffect, useState } from "react";
import { Navigate } from "react-router";
import { sendGithubInvite } from "../../actions/devgame";
import { btLoadingUser, btLoggedIn, btUser } from "../../actions/buckets";
import { useBucket } from "../../actions/bucket";
import { CodeBracketIcon, CheckCircleIcon } from "@heroicons/react/24/solid";
import { StopIcon } from "@heroicons/react/24/outline";

export function DevLogin() {
    const user = useBucket(btUser) as any;
    const loadingUser = useBucket(btLoadingUser);

    const [sentInvite, setSentInvite] = useState(false);
    const [acceptInvite, setAcceptInvite] = useState(false);
    const [toastMsg, setToastMsg] = useState<{ text: string; ok: boolean } | null>(null);

    useEffect(() => {
        if (toastMsg) {
            const t = setTimeout(() => setToastMsg(null), 4000);
            return () => clearTimeout(t);
        }
    }, [toastMsg]);

    const onInvite = async () => {
        const success = await sendGithubInvite();
        if (success) {
            setToastMsg({ text: "Invite sent successfully", ok: true });
            setSentInvite(true);
        } else {
            setToastMsg({ text: "Invite failed.", ok: false });
        }
    };

    if (user && user.isdev && user.github) {
        return <Navigate to="/dev" />;
    }
    if (user && user.apikey && user.apikey.length > 0 && user.apikey !== "undefined") {
        return <></>;
    }
    if (loadingUser) return <></>;

    const loggedIn = btLoggedIn.get();
    const showInvite = (user && !user.isdev) || !sentInvite;
    const showLogin = !user || !user?.github;

    const step1 = loggedIn && user?.github;
    const step2 = step1 && sentInvite;
    const step3 = step2 && acceptInvite;

    const StepIcon = ({ done }: { done: boolean }) =>
        done ? (
            <CheckCircleIcon className="w-5 h-5 text-green-400" />
        ) : (
            <StopIcon className="w-5 h-5 text-white/40" />
        );

    return (
        <div className="flex justify-center w-full px-8 pt-16 pb-24 bg-black/20">
            {toastMsg && (
                <div
                    className={[
                        "fixed top-6 right-6 px-5 py-3 rounded-lg text-white text-sm shadow-lg z-50",
                        toastMsg.ok ? "bg-green-700" : "bg-red-700",
                    ].join(" ")}
                >
                    {toastMsg.text}
                </div>
            )}
            <div className="flex flex-col items-start gap-8 w-full max-w-xl">
                <h1 className="text-3xl font-bold text-white">Developer Access</h1>

                <div className="flex flex-col gap-4 w-full">
                    <div className="flex items-center gap-3">
                        <StepIcon done={!!step1} />
                        <span className="text-white/70">
                            Step 1: Log in with GitHub
                        </span>
                    </div>
                    {showLogin && (
                        <a
                            href="/api/v1/auth/github"
                            className="flex items-center gap-2 px-5 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition w-fit"
                        >
                            <CodeBracketIcon className="w-5 h-5" />
                            Login with GitHub
                        </a>
                    )}

                    <div className="flex items-center gap-3">
                        <StepIcon done={!!step2} />
                        <span className="text-white/70">
                            Step 2: Request GitHub organization invite
                        </span>
                    </div>
                    {showInvite && (
                        <button
                            onClick={onInvite}
                            className="px-5 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition w-fit"
                        >
                            Send GitHub Invite
                        </button>
                    )}

                    <div className="flex items-center gap-3">
                        <StepIcon done={!!step3} />
                        <span className="text-white/70">
                            Step 3: Accept the GitHub organization invite
                        </span>
                    </div>
                    {sentInvite && (
                        <label className="flex items-center gap-2 cursor-pointer text-white/60 text-sm">
                            <input
                                type="checkbox"
                                checked={acceptInvite}
                                onChange={(e) => setAcceptInvite(e.target.checked)}
                                className="w-4 h-4"
                            />
                            I've accepted the invite
                        </label>
                    )}
                </div>
            </div>
        </div>
    );
}
