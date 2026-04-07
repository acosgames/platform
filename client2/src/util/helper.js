const ModeFromID = ["experimental", "rank", "public", "private"];
const ModeFromName = {
    experimental: 0,
    rank: 1,
    public: 2,
    private: 3,
};

export function getGameModeID(name) {
    return ModeFromName[name];
}

export function getGameModeName(id) {
    return ModeFromID[id];
}

export function calculateGameSize(
    windowWidth,
    windowHeight,
    resow,
    resoh,
    offsetRatio,
    prioritizeWidth
) {
    offsetRatio = offsetRatio || 1;

    windowWidth *= offsetRatio;
    windowHeight *= offsetRatio;

    let bgWidth = 0;
    let bgHeight = 0;
    let scale = 1;
    let wsteps = windowWidth / resow;
    let hsteps = windowHeight / resoh;
    let steps = 0;

    if (wsteps < hsteps || (prioritizeWidth && windowHeight > windowWidth)) {
        steps = wsteps;
    } else {
        steps = hsteps;
    }

    bgWidth = steps * resow;
    bgHeight = steps * resoh;

    return { bgWidth, bgHeight };
}
