const CopyWebpackPlugin = require("copy-webpack-plugin");
const ZipPlugin = require("zip-webpack-plugin");
const path = require("path");

// Generate pages object
const pagesObj = {};

const chromeName = ["popup", "options"];

chromeName.forEach((name) => {
  pagesObj[name] = {
    entry: `src/${name}/index.js`,
    template: "public/index.html",
    filename: `${name}.html`,
  };
});

let plugins = [
  CopyWebpackPlugin([
    {
      from: path.resolve("src/assets"),
      to: `${path.resolve("dist")}/assets`,
    },
  ]),
];

// 开发环境将热加载文件复制到dist文件夹
if (process.env.NODE_ENV !== "production") {
  plugins.push(
    CopyWebpackPlugin([
      {
        from: path.resolve("src/manifest.dev.json"),
        to: `${path.resolve("dist")}/manifest.json`,
      },
      {
        from: path.resolve("src/hot-reload.js"),
        to: path.resolve("dist"),
      }
    ])
  );
}

// 生产环境打包dist为zip
if (process.env.NODE_ENV === "production") {
  plugins.push(
    CopyWebpackPlugin([
      {
        from: path.resolve("src/manifest.production.json"),
        to: `${path.resolve("dist")}/manifest.json`,
      }
    ])
  );
  plugins.push(
    new ZipPlugin({
      path: path.resolve("dist"),
      filename: "dist.zip",
    })
  );
}

module.exports = {
  pages: pagesObj, //多入口
  lintOnSave: false,
  configureWebpack: {
    //单独的文件
    entry: {
      content: "./src/content/index.js",
      background: "./src/background/index.js",
    },
    output: {
      filename: "js/[name].js",
    },
    plugins: plugins,
  },

  chainWebpack: (config) => {
    // 查看打包组件大小情况
    if (process.env.npm_config_report) {
      config
        .plugin("webpack-bundle-analyzer")
        .use(require("webpack-bundle-analyzer").BundleAnalyzerPlugin);
    }
  },
};
