import { bucket } from "./bucket";

export const btLeaderboard = bucket({});

export const btUser = bucket(null);
export const btGames = bucket({});
export const btGame = bucket({});

export const btLeaderboardFilters = bucket({
    type: null,
});

export const btNationalRankings = bucket({});
export const btRankings = bucket({});
export const btDivision = bucket({});

export const btLoading = bucket({});

export const btIsMobile = bucket(false);
export const btLayoutMode = bucket("right");
export const btLayoutBottomMode = bucket("none");
export const btLayoutRightMode = bucket("none");

export const btScoreboardExpanded = bucket(true);
export const btLobbyExpanded = bucket(false);
export const btChatExpanded = bucket(false);

export const btLoggedIn = bucket("CHECKING");
export const btIsCreateDisplayName = bucket(false);
export const btJoinButtonVisible = bucket(false);

export const btHistory = bucket(null);
export const btLocationPath = bucket("");

export const btPrimaryCanvasRef = bucket(null);
export const btChatUpdated = bucket(Date.now());
export const btChannel = bucket([]);
export const btLastChatSent = bucket(Date.now());

export const btChatMessage = bucket("");
export const btWebsocket = bucket(null);

export const btRoomSlug = bucket(null);
export const btQueues = bucket([]);
export const btRooms = bucket([]);

export const btLatency = bucket(0);
export const btTimeleft = bucket({});
export const btTimeleftUpdated = bucket(0);

export const btShowLoadingBox = bucket({});

export const btChatToggle = bucket(false);
export const btJoinQueues = bucket(false);

export const btWebsocketConnected = bucket(false);
export const btDuplicateTabs = bucket(false);
export const btServerOffset = bucket(0);
export const btOffsetTime = bucket(0);
export const btPlayerStats = bucket({});

export const btDevGameImages = bucket([]);
export const btDevGame = bucket({});
export const btDevGames = bucket([]);
export const btDevClientImages = bucket([]);
export const btDevClients = bucket([]);
export const btDevServerImages = bucket([]);
export const btDevServers = bucket([]);
export const btDevServerError = bucket([]);
export const btDevClientsError = bucket([]);
export const btLoadingGames = bucket([]);
export const btGameTemplates = bucket([]);

export const btDevGameError = bucket([]);
export const btLoadedDevGame = bucket(Date.now());
export const btDevGameTeams = bucket([]);
export const btDevClientsEnv = bucket(null);
export const btDevClientImagesById = bucket({});
export const btDevClientBundles = bucket({});

export const btRankList = bucket([]);
export const btExperimentalList = bucket([]);
export const btGameLists = bucket({});

export const btGameFound = bucket(false);
export const btReplay = bucket({});
export const btLoadingHightscores = bucket(null);
export const btLocalPlayerHighscores = bucket(null);
export const btLeaderboardHighscoreChange = bucket(null);
export const btLeaderboardHighscore = bucket([]);
export const btLeaderboardHighscoreCount = bucket([]);

export const btGameSlug = bucket(null);
export const btJSGame = bucket(true);

export const btVersion = bucket(0);
export const btUserId = bucket(0);

export const btLoadingDefaultCountry = bucket(false);
export const btDefaultCountry = bucket("US");
export const btProfile = bucket(null);
export const btDisplayName = bucket(null);

export const btLoadingProfile = bucket(false);
export const btLoadingUser = bucket(false);
export const btLoginFrom = bucket("game");
export const btPortraitId = bucket(Math.floor(Math.random() * (2104 - 1 + 1) + 1));

export const btJustCreatedName = bucket(false);
export const btCheckingUserLogin = bucket(true);
export const btQueueStats = bucket(null);
export const btGamePanels = bucket([]);
export const btLastJoin = bucket(null);

export const btGamePanelById = bucket({});
export const btPrimaryState = bucket({});

export const btPrimaryGamePanel = bucket(null);
export const btChatMode = bucket("all");

export const btIframes = bucket({});
export const btDisplayMode = bucket("none");
export const btGameStatus = bucket({});
export const btPlayerCount = bucket(0);
export const btGameTimeLeft = bucket(0);
export const btPageHistory = bucket([]);
export const btChatViewRef = bucket(null);
export const btScoreboardRef = bucket(null);
export const btResized = bucket(Date.now());
export const btIsFullScreen = bucket(false);
export const btLoadingGameInfo = bucket(false);
export const btReplayNavigated = bucket(false);
export const btChat = bucket([]);
export const btChatRoom = bucket([]);
export const btError = bucket(null);
export const btRefPath = bucket(null);
export const btNotif = bucket({
    title: "",
    description: "",
    status: "",
    isClosable: true,
});

export const btDevClient = bucket({});
export const btShowCreateClient = bucket(false);
export const btScreenResized = bucket(false);
export const btHideDrawer = bucket(false);
export const btScreenRect = bucket(null);
export const btCountryChanged = bucket(false);
export const btPortraitSort = bucket(null);
export const btPortraitObserver = bucket(null);
export const btPortraitRange = bucket([1, 100]);
export const btIsChoosePortrait = bucket(false);
export const btIframesLoaded = bucket({});
export const btGameScreenSize = bucket(null);
export const btGameStatusUpdated = bucket(Date.now());
export const btFullScreenElem = bucket(null);
export const btPrimaryRoom = bucket(null);
export const btReplays = bucket({});

export const btPortraitBottomRef = bucket(null);

export const btFormFields = bucket({});
export const btAchievementForm = bucket({});
export const btAchievementFormErrors = bucket({});

export const btExperience = bucket({});
export const btRankingUpdate = bucket({});

export const btShowCreateAchievement = bucket(false);
export const btEditAchievement = bucket(null);

export const btAchievements = bucket([]);
export const btIsChooseAchievementIcon = bucket(false);
export const btAchievementIconBottomRef = bucket(null);
export const btAchievementRange = bucket([1, 100]);
export const btAchievementObserver = bucket(null);
export const btAchievementSort = bucket(null);
export const btAchievementIconId = bucket(Math.floor(Math.random() * (100 - 1 + 1) + 1));

export const btClaimingAchievement = bucket(false);
export const btAchievementAward = bucket(false);
