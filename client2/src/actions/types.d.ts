type CacheConfig = {
    type?: string;
    game_slug?: string;
    countrycode?: string;
    season?: number;
    division_id?: string;
    stat_slug?: string;
    monthly?: boolean;
    redisKey?: string;
}


type RoomInfo = {
    room_slug: string;
    game_slug: string;
    maxplayers: number;
    created_at: string;
    updated_at: string;
}

type GameInfo = {
    gameid: string;
    game_slug: string;
    version: number;
    shortdesc: string;
    latest_version: number;
    db: number;
    css: number;
    screentype: number;
    resow: number;
    resoh: number;
    screenwidth: number;
    latest_screentype: number;
    latest_resow: number;
    latest_resoh: number;
    latest_screenwidth: number;
    latest_db: number;
    latest_css: number;
    name: string;
    preview_images: string;
    lbscore: number;
    status: number;
    maxplayers: number;
    queueCount: number;
}


type GameStat = {
    stat_slug: string;
    algorithm_id: string | null;
    game_slug: string;
    stat_name: string;
    stat_abbreviation: string;
    stat_desc: string;
    icon?: string;
    valueTYPE: number;
    isactive: number;
    scoreboard?: number;
    stat_order?: number;
    tsinsert?: string;
    tsupdate?: string;
}

type GameAchievement = {
    game_slug: string;
    achievement_slug: string;
    achievement_name: string;
    achievement_description: string;
    achievement_icon: string | null;
    stat_slug1: string | null;
    goal1_valueINT: number | null;
    goal1_valueFLOAT: number | null;
    goal1_valueSTRING: string | null;
    stat_slug2: string | null;
    goal2_valueINT: number | null;
    goal2_valueFLOAT: number | null;
    goal2_valueSTRING: string | null;
    stat_slug3: string | null;
    goal3_valueINT: number | null;
    goal3_valueFLOAT: number | null;
    goal3_valueSTRING: string | null;
    all_required: number | null;
    within_one_match: number | null;
    times_in_a_row: number;
    award_item: string | null;
    award_xp: number | null;
    award_gamepoints: number | null;
    award_badge: string | null;
    tsinsert: string;
    tsupdate: string;
    goal1_valueTYPE: number | null;
    goal2_valueTYPE: number | null;
    goal3_valueTYPE: number | null;
    stat_name1: string | null;
}

type QueuePlayer = {
    shortid: string;
    displayname: string;
    portraitid: number;
    countrycode: string;
}

type QueueGame = {
    game_slug: string;
    mode: string;
    preview_image: string;
    name: string;
}

type QueueRequest = {
    captain: string;
    partyid: string;
    players: QueuePlayer[];
    queues: QueueGame[];
    owner: string;
}


type GameInfoFull = {
    shortid: string;
    displayname: string;
    github: string;
    gameid: string;
    game_slug: string;
    name: string;
    version: number;
    db: number;
    season: number;
    visible: number;
    latest_version: number;
    ownerid: string;
    minplayers: number;
    maxplayers: number;
    lbscore: number;
    maxteams: number;
    minteams: number;
    shortdesc: string;
    longdesc: string;
    opensource: number;
    template: string;
    preview_images: string;
    videourl: string | null;
    genre: string | null;
    votes: number;
    status: number;
    tsupdate: string;
    tsinsert: string;
    screentype: number;
    resow: number;
    resoh: number;
    screenwidth: number;
    css: number;
    latest_screentype: number;
    latest_resow: number;
    latest_resoh: number;
    latest_screenwidth: number;
    latest_db: number;
    latest_css: number;
    stats: GameStat[];
    achievements: GameAchievement[];
}

type PlayerDeveloper = {
    apikey: string;
    prevapikey: string;
    tsapikey: string;
    github_id: number;
    github_teamid: number;
}

type PlayerPrivate = {
    email?:string;
    id?: string;
    webpush?: string;
    tsinsert?: string;
    tsupdate?: string;
    token: string;
    exp: number;
}

type PlayerPublic = {
    shortid: string;
    displayname: string;
    countrycode: string;
    portraitid: number;
    github: string;
    membersince: string;
    isdev: boolean;
    points: number;
    level: number;
}



type WSMessage = {
    data: ArrayBuffer;
    origin: string;
}

type ACOSMessage = {
    type: string;
    payload: any;
    room?: {
        [key: string]: any;
        room_slug?: string;
        game_slug?: string;
        maxplayers?: number;
    };
    game_slug?: string;
    room_slug?: string;
    local?: any;
}


type ChatPayload = {
    message: string;
    game_slug?: string;
    room_slug?: string;
    sender?: string;
    timestamp?: string;
}
type ChatMessage = {
    payload: ChatPayload | ChatPayload[];
    room_slug?: string;
}
