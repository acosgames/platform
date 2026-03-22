declare module "../config" {
  const config: {
    https: {
      cdn: string;
    };
    [key: string]: unknown;
  };

  export default config;
}
