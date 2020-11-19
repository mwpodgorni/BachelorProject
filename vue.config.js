module.exports = {
  chainWebpack: (config) => {
    /* disable insertion of assets as data urls b/c Phaser doesn't support it */
    const rules = [
      { name: "images", dir: "img" },
      { name: "media", dir: "media" },
    ];
    rules.forEach((rule) => {
      const ruleConf = config.module.rule(rule.name);

      ruleConf.uses.clear();

      ruleConf
        .use("file-loader")
        .loader("file-loader")
        .options({
          name: `${rule.dir}/[name].[hash:8].[ext]`,
        });
    });
  },
  pwa: {
    // <---- this is PWA name
    name: "JugSquare",
    themeColor: "#133b5c",
    msTileColor: "#000000",
    appleMobileWebAppCapable: "yes",
    appleMobileWebAppStatusBarStyle: "black",
    iconPaths: {
      favicon32: "icons/favicon-32x32.png",
      favicon16: "icons/favicon-16x16.png",
      appleTouchIcon: "icons/apple-touch-icon.png",
      maskIcon: "icons/safari-pinned-tab.svg",
      msTileImage: "icons/mstile-150.png",
    },
  },
  devServer: {
    open: true,
    hot: false,
  },
};
