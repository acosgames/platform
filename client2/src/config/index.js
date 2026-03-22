import cfg from './config.json'

let NODE_ENV = process.env.NODE_ENV;
var config =
    (NODE_ENV == 'production') ? cfg.prod :
        (NODE_ENV == 'mobile') ? cfg.mobile :
            cfg.local;

export default config;