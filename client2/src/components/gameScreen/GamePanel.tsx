

import { useEffect, useRef, useState } from "react";

import { sendLoadMessage } from "../../actions/connection";
import config from "../../config";
// import { BsArrowsFullscreen, } from 'react-icons/bs';
// import { CgMinimizeAlt } from "react-icons/cg";

import {
    getRoomStatus,
    RoomStatus,
    updateGamePanel,
} from "../../actions/room";

import LoadingBox from "./LoadingBox";

// import { CgMinimizeAlt } from "react-icons/cg";
import { calculateGameSize } from "@/util/helper.js";
import { useBucket, useBucketSelector } from "@/actions/bucket.ts";
import {
    btDisplayMode,
    btGamePanels,
    btIsFullScreen,
    btLayoutMode,
    btPrimaryGamePanel,
    btPrimaryRoom,
    btResized,
    btScreenResized,
    btShowLoadingBox,
} from "../../actions/buckets";

// import useBackButton from '../../widgets/useBackButton';

interface GamePanelProps {
    id: string;
    canvasRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
    prioritizeWidth?: boolean;
    displayMode?: string;
    isFullScreen?: boolean;
    hideInBackground?: boolean;
    children?: React.ReactNode;
    wrapperClassName?: string;
}

function GamePanel({ id, canvasRef, prioritizeWidth, hideInBackground, children, wrapperClassName }: GamePanelProps) {
    let gamepanel = useBucketSelector(btGamePanels, (bucket) => (bucket as Record<string, any>)[id]);
    useBucketSelector(btShowLoadingBox, (bucket) => (bucket as Record<string, any>)[id]);

    const primaryId = useBucket(btPrimaryGamePanel);
    const primaryRoom = useBucket(btPrimaryRoom) as any;
    const playSurfaceRef = useRef<HTMLDivElement>(null);

    const displayMode = useBucket(btDisplayMode);
    const isTheaterMode = displayMode === "theatre";
    const isFullscreen = displayMode === "fullscreen";

    // When btGamePanels doesn't have this panel, synthesize one from btPrimaryRoom
    if (!gamepanel && String(primaryId) === id && primaryRoom) {
        gamepanel = {
            id,
            available: false,
            isPrimary: true,
            room: primaryRoom,
            canvasRef: null,
            iframe: null,
            loaded: true,
        };
    }

    // const isBack = useBackButton(() => {
    //     if (gamepanel.isPrimary && gamepanel.room.isReplay) {
    //         setPrimaryGamePanel();
    //     }
    // });
    // const gamepanel = props.gamepanel;

    if (!gamepanel) {
        return <></>;
        // return <LoadingBox />
    }

    if (gamepanel.available) return <></>;

    const room_slug = gamepanel?.room?.room_slug;
    if (!room_slug) return <></>;
    // return <LoadingBox />

    // let room = getRoom(room_slug);
    // if (!room)
    //     return <LoadingBox />

    // let game = getGame(room.game_slug);
    // if (!game)
    // return <LoadingBox />
    let room = gamepanel.room;
    let resow = room.resow;
    let resoh = room.resoh;

    let resoRatio = ((resoh / resow) * 100.0).toFixed(2);

    return (
        // <Portal containerRef={gamepanel.draggableRef}>
        // <div className="relative w-full h-full">
        <div ref={playSurfaceRef} className={`play-surface min-h-0 drop-shadow-md ${hideInBackground ? "opacity-0" : ""}`}
            style={{
                paddingTop: isTheaterMode || isFullscreen ? `min(${resoRatio}%, 100vh)` : `min(${resoRatio}%, -130px + 100vh)`
            }}
        >
            {/* <LoadingBox id={gamepanel.id} /> */}
            <GameIFrame
                gamepanel={gamepanel}
                canvasRef={playSurfaceRef}
                prioritizeWidth={prioritizeWidth}
                wrapperClassName={wrapperClassName}
            >
                {children}
            </GameIFrame>
            {/* </div> */}

        </div>
        // </Portal>
    );
}

interface GameIFrameProps {
    gamepanel: any;
    canvasRef?: React.RefObject<HTMLElement | HTMLDivElement | null>;
    prioritizeWidth?: boolean;
    isFullScreen?: boolean;
    children?: React.ReactNode;
    wrapperClassName?: string;
}

function GameIFrame({ gamepanel, canvasRef, prioritizeWidth, isFullScreen, children, wrapperClassName }: GameIFrameProps) {
    useBucket(btScreenResized);
    // 'resize', 'isFullScreen', 'displayMode'

    let room = gamepanel.room;

    const [isOpen, setIsOpen] = useState(false);
    const [isLoaded] = useState(true);
    const iframeRef = useRef<HTMLIFrameElement>(null);
    const gamescreenRef = useRef<HTMLDivElement>(null);
    const gamewrapperRef = useRef<HTMLDivElement>(null);
    const gameResizer = useRef<HTMLDivElement>(null);

    const displayMode = useBucket(btDisplayMode);
    const isTheaterMode = displayMode === "theatre";
    const isFullscreen = displayMode === "fullscreen";

    const room_slug = room.room_slug;

    let screentype = room.screentype;
    let resow = room.resow;
    let resoh = room.resoh;
    let screenwidth = room.screenwidth;

    // if (room.mode == 'experimental') {
    //     screentype = game.latest_screentype;
    //     resow = game.latest_resow;
    //     resoh = game.latest_resoh;
    //     screenwidth = game.latest_screenwidth;
    // }
    let screenheight = (resoh / resow) * screenwidth;

    var timestamp = 0;
    var THROTTLE = 0;

    const transformStr = (obj: Record<string, string | number>) => {
        var obj = obj || {},
            val = "",
            j;
        for (j in obj) {
            val += j + "(" + obj[j] + ") ";
        }

        return `
            -webkit-transform: ${val}; 
            -moz-transform: ${val}; 
            transform: ${val};
            
        `;
    };

    const checkFullScreen = () => {
        if (
            document.fullscreenElement
            // ||
            // document.webkitFullscreenElement ||
            // document.mozFullScreenElement
        )
            return true;
        else return false;
    };

    const onResize = () => {
        btShowLoadingBox.get((bucket) => (bucket as Record<string, any>)[gamepanel.id]);
        if (!gamescreenRef?.current || !iframeRef?.current) {
            // console.log("NOT FOUND - gamescreenRef or iframeRef or loadingBox");
            return;
        }

        var now = new Date().getTime();
        if (now - timestamp < THROTTLE) {
            console.log("Throttled: ", now - timestamp);
            return onResize;
        }

        timestamp = now;

        checkFullScreen();
        var w =
            window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;

        var h =
            window.innerHeight ||
            document.documentElement.clientHeight ||
            document.body.clientHeight;

        let windowWidth = gamewrapperRef?.current?.offsetWidth || w;
        let windowHeight = gamewrapperRef?.current?.offsetHeight || h;
        if (canvasRef?.current) {
            windowWidth = canvasRef.current.offsetWidth;
            windowHeight = canvasRef.current.offsetHeight;
        }

        btLayoutMode.get();

        if (!gamepanel.isPrimary && gamepanel?.canvasRef?.current) {
            windowWidth = gamepanel.canvasRef.current.offsetWidth;
            windowHeight = gamepanel.canvasRef.current.offsetHeight;
        }

        if (windowHeight > document.documentElement.clientHeight) {
            windowHeight = document.documentElement.clientHeight;
        }

        if (windowWidth > document.documentElement.clientWidth) {
            windowWidth = document.documentElement.clientWidth;
        }

        let roomStatus: RoomStatus = getRoomStatus(room_slug);
        let offsetRatio = 1; // !isLoaded ? 0.1 : 1;

        if (isLoaded) {
            if (
                roomStatus == RoomStatus.GAME ||

                roomStatus == RoomStatus.LOADING ||
                roomStatus == RoomStatus.GAMEOVER ||
                roomStatus == RoomStatus.GAMECANCELLED ||
                roomStatus == RoomStatus.GAMEERROR
            ) {
                offsetRatio = 1;
            }
            if (roomStatus == RoomStatus.NOSHOW || roomStatus == RoomStatus.ERROR) {
                // offsetRatio = 0.4;
            }
        }

        let scale = 1;
        let oldHeight = gamescreenRef.current.style.height;

        if (screentype == "1") {
            // Full screen: container fills allotted space, iframe stretches to fill it
            gamescreenRef.current.style.width = windowWidth + "px";
            gamescreenRef.current.style.height = windowHeight + "px";
            iframeRef.current.setAttribute("style", "width:100%; height:100%;");
        } else if (screentype == "2") {
            // Fixed resolution: maximize container to fit canvas maintaining resow x resoh aspect ratio, iframe stretches to fill
            let { bgWidth, bgHeight } = calculateGameSize(
                windowWidth,
                windowHeight,
                resow,
                resoh,
                offsetRatio,
                prioritizeWidth
            );
            gamescreenRef.current.style.width = bgWidth + "px";
            gamescreenRef.current.style.height = bgHeight + "px";
            iframeRef.current.setAttribute("style", "width:100%; height:100%;");
        } else {
            // screentype == "3" (or unset): Scaled resolution — iframe is fixed pixel size,
            // container is scaled via CSS transform to fit inside the allotted space
            let { bgWidth, bgHeight } = calculateGameSize(
                windowWidth,
                windowHeight,
                resow,
                resoh,
                offsetRatio,
                prioritizeWidth
            );
            gamescreenRef.current.style.width = bgWidth + "px";
            gamescreenRef.current.style.height = bgHeight + "px";
            scale = bgWidth / screenwidth;

            iframeRef.current.setAttribute(
                "style",
                transformStr({
                    scale: scale,
                    translateZ: "0",
                }) +
                `; transform-origin: left top; width:${screenwidth}px; height:${screenheight}px;`
            );
        }

        if (oldHeight !== "" && oldHeight != gamescreenRef.current.style.height)
            btResized.set(Date.now());
    };

    const myObserver = new ResizeObserver((_entries) => {
        // this will get called whenever div dimension changes
        //  entries.forEach(entry => {
        //    console.log('width', entry.contentRect.width);
        //    console.log('height', entry.contentRect.height);
        //  });
        onResize();
        setTimeout(onResize, 500);
    });

    const onFullScreenChange = (_evt: Event) => {
        if (document.fullscreenElement) {
            btIsFullScreen.set(true);
        } else {
            btIsFullScreen.set(false);
        }
    };

    useEffect(() => {
        window.addEventListener("resize", onResize);
        document.addEventListener("fullscreenchange", onFullScreenChange);

        myObserver.observe(gameResizer.current!);

        // if (gamepanel.isPrimary) {
        // }
        setTimeout(() => {
            setIsOpen(true);
        }, 10);

        return () => {
            window.removeEventListener("resize", onResize);
            setIsOpen(false);
        };
    }, []);

    useEffect(() => {
        onResize();

        setTimeout(onResize, 1000);
    });

    let iframeURL = `${config.https.cdn}static/iframe.html`;
    if (window.location.hostname === "localhost") iframeURL = "/iframe.html";

    return (
        <>
            <div
                ref={gameResizer}
                className={`gameResizer absolute flex flex-col w-full z-10 top-0 left-0 ${isTheaterMode || isFullscreen ? "justify-center items-center" : "justify-center items-center"}  drop-shadow-md`}
            >
                {/* <LoadingBox isDoneLoading={gamepanel.loaded} /> */}
                <div
                    className={`screen-wrapper flex flex-col  w-full relative ${wrapperClassName}`}
                    ref={gamewrapperRef}
                    style={{
                        transition: "filter 0.3s ease-in, opacity 0.5s ease-in",
                        filter: isOpen ? "opacity(1)" : "opacity(0)",
                    }}
                >
                    <div
                        ref={gamescreenRef}
                        className={`gamescreenRef relative overflow-hidden  ${isTheaterMode || isFullscreen ? "" : "rounded-xl"}`}
                        key={"gamescreenRef-" + gamepanel.id}
                        style={{ filter: "drop-shadow(5px 5px 10px var(--chakra-colors-primary-1200))" }}
                    >
                        {/* <ScaleFade initialScale={1} in={gamepanel.loaded} width="100%" height="100%" position="relative"> */}

                        {/* </ScaleFade> */}
                        <iframe
                            key={"iframe-game-" + gamepanel.id}
                            className="gamescreen"
                            ref={iframeRef}
                            // onResize={onResize}
                            onLoad={() => {
                                //let gamepanel = findGamePanelByRoom(room_slug);
                                gamepanel.iframe = iframeRef;
                                // setIFrame(room_slug, iframeRef);

                                sendLoadMessage(room_slug);
                                onResize();
                                // setTimeout(() => {
                                //     onResize();
                                // }, 1000);
                                if (gamepanel.room.isReplay) {
                                    //replaySendGameStart(room_slug);
                                } else {
                                    updateGamePanel(gamepanel);
                                }
                            }}
                            src={iframeURL}
                            // srcDoc={iframeSrc}
                            // allowTransparency={true}
                            sandbox="allow-scripts allow-same-origin"
                        />
                        {/* <GameMessageOverlay gamepanel={gamepanel} /> */}
                    </div>
                </div>

                {/* <div
                    className="absolute bottom-4 right-4"
                    style={{ display: isFullScreen || displayMode == "theatre" ? "block" : "none" }}
                >
                    <button
                        className="text-4xl bg-transparent border-none cursor-pointer"
                        onClick={() => {
                            if (displayMode == "theatre") {
                                btDisplayMode.set("normal");
                            }
                            if (isFullScreen) document.exitFullscreen();
                            // openFullscreen(props.fullScreenElem)
                        }}
                        aria-label="Exit Full Screen"
                    >
                        <CgMinimizeAlt />
                    </button>
                </div> */}
                {/* <div className="w-full h-12 bg-blue-500"></div> */}
            </div>

            {children}
        </>
    );
}

// let onCustomWatched = ownProps => {
//     return ['gamepanel/' + ownProps.id];
// };
// let onCustomProps = (key, value, store, ownProps) => {
//     if (key == ('gamepanel/' + ownProps.id))
//         return { gamepanel: value }
//     return {};
// };

export default GamePanel;
