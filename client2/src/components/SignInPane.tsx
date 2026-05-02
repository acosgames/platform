import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import {
  FacebookLoginButton,
  GithubLoginButton,
  GoogleLoginButton,
  MicrosoftLoginButton,
} from "react-social-login-buttons";
import config from "../config";
import { createTempUser } from "@/actions/person";
import { useBucket, useBucketSelector } from "@/actions/bucket";
import { btModalShow, btPortraitId } from "@/actions/buckets";
import { removeWithExpiry } from "@/actions/cache";

interface SignInPaneProps {
  onSignIn: () => void;
}

type CountryOption = {
  code: string;
  label: string;
};

const FALLBACK_COUNTRIES = [
  "US", "CA", "MX", "BR", "AR", "CL", "GB", "IE", "FR", "DE", "ES", "IT", "NL", "BE", "SE", "NO", "FI", "DK", "PL", "PT", "CZ", "AT", "CH", "HU", "RO", "GR", "TR", "UA", "RU", "IL", "SA", "AE", "EG", "ZA", "NG", "KE", "IN", "PK", "BD", "TH", "VN", "MY", "SG", "ID", "PH", "CN", "JP", "KR", "TW", "HK", "AU", "NZ",
];

function getCountryOptions(): CountryOption[] {
  let regions = FALLBACK_COUNTRIES;

  const intlWithSupportedValuesOf = Intl as { supportedValuesOf?: (key: string) => string[] };
  if (typeof intlWithSupportedValuesOf.supportedValuesOf === "function") {
    try {
      regions = intlWithSupportedValuesOf.supportedValuesOf("region");
    } catch {
      regions = FALLBACK_COUNTRIES;
    }
  }

  const display = new Intl.DisplayNames(["en"], { type: "region" });

  return regions
    .filter((code) => /^[A-Z]{2}$/.test(code))
    .map((code) => ({ code, label: display.of(code) ?? code }))
    .sort((a, b) => a.label.localeCompare(b.label));
}



export function SignInPane({ onSignIn }: SignInPaneProps) {

  const showSignIn = useBucketSelector(btModalShow, (state) => state.signIn);

  // const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPortraitModalOpen, setIsPortraitModalOpen] = useState(false);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [portraitVisibleCount, setPortraitVisibleCount] = useState(120);
  const [displayName, setDisplayName] = useState("");
  const [portraitId, setPortraitId] = useState(1);
  const [countryCode, setCountryCode] = useState("US");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const countryOptions = useMemo(() => getCountryOptions(), []);

  const filteredCountries = useMemo(() => {
    const term = countrySearch.trim().toLowerCase();
    if (!term) return countryOptions;
    return countryOptions.filter((option) => option.label.toLowerCase().includes(term) || option.code.toLowerCase().includes(term));
  }, [countryOptions, countrySearch]);

  const selectedCountry = useMemo(
    () => countryOptions.find((option) => option.code === countryCode) ?? { code: countryCode, label: countryCode },
    [countryOptions, countryCode],
  );

  const portraitSrc = `${config.https.cdn}images/portraits/assorted-${portraitId}-medium.webp`;

  const onOpenSignIn = () => {
    setErrorMessage("");
    btModalShow.assign({"signIn": true});
  };

  const onCloseSignIn = () => {
    setCountrySearch("");
    btModalShow.assign({"signIn": false, "country": false});
  };

  const onPickPortrait = (nextPortraitId: number) => {
    setPortraitId(nextPortraitId);
    setIsPortraitModalOpen(false);
  };

  const onPortraitScroll: React.UIEventHandler<HTMLDivElement> = (e) => {
    const target = e.currentTarget;
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 180;
    if (!nearBottom) return;

    setPortraitVisibleCount((prev) => Math.min(prev + 120, 2100));
  };

  const onCreateTempAccount = async () => {
    const cleanDisplayName = displayName.trim();
    if (!cleanDisplayName) {
      setErrorMessage("Please enter a player name.");
      return;
    }

    setErrorMessage("");
    setIsSubmitting(true);

    try {
      //   await createTempAccount({
      //     displayname: cleanDisplayName,
      //     portraitid: portraitId,
      //     countrycode: countryCode,
      //   });

      await createTempUser({ displayname: cleanDisplayName, portraitid: portraitId, countrycode: countryCode });


      onSignIn();
      onCloseSignIn();
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Could not create temporary account.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const socialProviders = [
    { label: "Google", Component: GoogleLoginButton, path: "/login/google" },
    { label: "Facebook", Component: FacebookLoginButton, path: "/login/facebook" },
    { label: "Microsoft", Component: MicrosoftLoginButton, path: "/login/microsoft" },
    { label: "GitHub", Component: GithubLoginButton, path: "/login/github" },
  ];

  const updateRefPath = (pathname: string) => {
      localStorage.setItem("refPath", pathname);
      // btRefPath.set(pathname);
      removeWithExpiry("user");
  
      localStorage.setItem("portraitid", btPortraitId.get());
  }
  
            
  const signInModal = showSignIn ? (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 ">
      <button
        type="button"
        className="absolute inset-0 bg-black/65 backdrop-blur-[5px]"
        aria-label="Close sign in modal"
        onClick={onCloseSignIn}
      />

      <div className="relative w-full max-w-xl rounded-md border border-white/15 bg-card/95 p-4 sm:p-5 space-y-4 bg-linear-to-b from-slate-50/95 to-slate-100/90 dark:from-gray-950 dark:to-black">
        <div className="flex items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">Create Account</h3>
          <button
            type="button"
            onClick={onCloseSignIn}
            className="h-8 w-8 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground hover:border-cyan-400/40"
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        <div className="space-y-3">
          <div className="grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-3 items-start">
            <button
              type="button"
              onClick={() => setIsPortraitModalOpen(true)}
              className="group relative rounded-md border border-white/15 bg-black/25 p-1 hover:border-cyan-400/45 transition-colors"
            >
              <img src={portraitSrc} alt={`Portrait ${portraitId}`} className="w-32 h-32 rounded-md object-cover" />
              <span className="absolute bottom-1 left-1/2 -translate-x-1/2 text-[10px] px-1.5 py-0.5 rounded bg-black/65 text-white/85 opacity-0 group-hover:opacity-100 transition-opacity">
                Change
              </span>
            </button>

            <div className="space-y-3 min-w-0">
              <div className="space-y-1">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Player Name</label>
                <input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="Type your player name"
                  className="w-full h-9 rounded-md border border-white/15 bg-black/20 px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-cyan-400/45"
                />
              </div>

              <div className="space-y-1 relative">
                <label className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">Country</label>
                <button
                  type="button"
                  onClick={() => setIsCountryOpen((prev) => !prev)}
                  className="w-full h-9 rounded-md border border-white/15 bg-black/20 px-2.5 text-sm text-foreground flex items-center justify-between gap-2 hover:border-cyan-400/45"
                >
                  <span className="flex items-center gap-2 min-w-0">
                    <img
                      src={`${config.https.cdn}images/country/${selectedCountry.code}.svg`}
                      alt={`${selectedCountry.code} flag`}
                      className="w-5 h-3.5 rounded-[2px] object-cover border border-white/15 shrink-0"
                    />
                    <span className="truncate">{selectedCountry.label}</span>
                  </span>
                  <span className="text-xs text-muted-foreground">▾</span>
                </button>

                {isCountryOpen && (
                  <div className="absolute z-20 mt-1 w-full rounded-md border border-white/15 bg-popover shadow-2xl shadow-black/45 overflow-hidden">
                    <div className="p-2 border-b border-white/10">
                      <input
                        value={countrySearch}
                        onChange={(e) => setCountrySearch(e.target.value)}
                        placeholder="Search country"
                        className="w-full h-8 rounded-md border border-white/15 bg-black/25 px-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none"
                      />
                    </div>
                    <div className="max-h-56 overflow-y-auto panel-scrollbar py-1">
                      {filteredCountries.map((option) => (
                        <button
                          key={option.code}
                          type="button"
                          onClick={() => {
                            setCountryCode(option.code);
                            setIsCountryOpen(false);
                            setCountrySearch("");
                          }}
                          className="w-full px-2.5 py-2 text-left hover:bg-white/5 flex items-center gap-2"
                        >
                          <img
                            src={`${config.https.cdn}images/country/${option.code}.svg`}
                            alt={`${option.code} flag`}
                            className="w-5 h-3.5 rounded-[2px] object-cover border border-white/15 shrink-0"
                          />
                          <span className="text-xs text-foreground truncate">{option.label}</span>
                          <span className="text-[10px] text-muted-foreground ml-auto">{option.code}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <button
            type="button"
            disabled={isSubmitting}
            onClick={() => void onCreateTempAccount()}
            className="w-full h-10 rounded-md text-sm font-semibold text-background bg-linear-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Creating Account..." : "Let's Go"}
          </button>

          {errorMessage ? <p className="text-[11px] text-rose-300">{errorMessage}</p> : null}
        </div>

        <div className="pt-3 border-t border-white/10 space-y-2">
          <p className="text-[12px] font-semibold text-muted-foreground uppercase tracking-wide">OR, Access more features with social login</p>
          <div className="grid grid-cols-2 gap-2">
            {socialProviders.map((provider) => {
              const SocialButton = provider.Component;
              return (
                <SocialButton
                  key={provider.label}
                  text={`Let's Go with ${provider.label}`}
                  type="button"
                  onClick={() => {
                    updateRefPath(window.location.pathname);
                    window.location.href = provider.path;
                   }}
                  size="36px"
                  iconSize="16px"
                  align="center"
                  className="m-0! h-9! rounded-md! text-xs! font-semibold! shadow-none! transition-all! duration-150!"
                />
              );
            })}
          </div>
          <p className="text-[10px] text-muted-foreground/90">
            By continuing, you agree to our terms of service and acknowledge our community guidelines.
          </p>
        </div>
      </div>
    </div>
  ) : null;

  const portraitModal = isPortraitModalOpen ? (
    <div className="fixed inset-0 z-60 flex items-center justify-center p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/70 backdrop-blur-[2px]"
        aria-label="Close portrait modal"
        onClick={() => setIsPortraitModalOpen(false)}
      />

      <div className="relative w-full max-w-4xl rounded-md border border-white/15 bg-card/95 p-4 space-y-3 shadow-[0_20px_40px_rgba(0,0,0,0.5)]">
        <div className="flex items-center justify-between gap-3">
          <h4 className="text-sm font-semibold text-foreground">Choose Portrait</h4>
          <button
            type="button"
            onClick={() => setIsPortraitModalOpen(false)}
            className="h-8 w-8 rounded-md border border-white/15 bg-white/5 text-foreground/80 hover:text-foreground"
            aria-label="Close portrait picker"
          >
            ✕
          </button>
        </div>

        <div className="max-h-[68vh] overflow-y-auto panel-scrollbar pr-1" onScroll={onPortraitScroll}>
          <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-7 lg:grid-cols-7 gap-2">
            {Array.from({ length: portraitVisibleCount }, (_, idx) => idx + 1).map((id) => (
              <button
                key={id}
                type="button"
                onClick={() => onPickPortrait(id)}
                className={`rounded-md border p-1 transition-colors ${id === portraitId
                    ? "border-cyan-300/60 bg-cyan-500/18"
                    : "border-white/12 bg-black/25 hover:border-cyan-400/40"
                  }`}
              >
                <img
                  src={`${config.https.cdn}images/portraits/assorted-${id}-medium.webp`}
                  alt={`Portrait ${id}`}
                  loading="lazy"
                  className="w-full aspect-square rounded-md object-cover"
                />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      {/* <section className="relative rounded-md border border-cyan-500/35 dark:border-cyan-400/35 bg-linear-to-b from-cyan-50/95 to-slate-100/90 dark:from-card dark:to-card/85 backdrop-blur-sm ring-1 ring-cyan-500/20 dark:ring-cyan-300/15 p-3.5 space-y-3 shrink-0 overflow-hidden shadow-[0_10px_24px_rgba(0,0,0,0.22)] dark:shadow-[0_10px_24px_rgba(0,0,0,0.35)]">
        <div className="absolute inset-0 bg-linear-to-br from-cyan-500/10 via-transparent to-purple-500/10 pointer-events-none" />

        <div className="relative space-y-0.5">
          <h3 className="text-sm font-semibold text-foreground">Ready To Play?</h3>
          <p className="text-[11px] text-muted-foreground">Sign in to join games, queue with friends, unlock live chat and more.</p>
        </div>

        <button
          type="button"
          onClick={onOpenSignIn}
          className="relative w-full h-9 rounded-md text-xs font-semibold text-background bg-linear-to-r from-cyan-400 via-cyan-500 to-blue-500 hover:from-cyan-300 hover:via-cyan-400 hover:to-blue-400 transition-all duration-200 shadow-[0_0_18px_rgba(0,217,255,0.32)] hover:shadow-[0_0_26px_rgba(0,217,255,0.5)] active:scale-[0.99]"
        >
          <span className="inline-flex items-center gap-1.5">
            <span className="text-[13px] leading-none">⚡</span>
            Sign In
          </span>
        </button>
      </section> */}

      {typeof document !== "undefined" ? createPortal(signInModal, document.body) : null}
      {typeof document !== "undefined" ? createPortal(portraitModal, document.body) : null}
    </>
  );
}
