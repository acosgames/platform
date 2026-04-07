declare const config: {
  https: {
    cdn: string;
    api: string;
    ws: string;
  };
  [key: string]: unknown;
};

export default config;
