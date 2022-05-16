const fs = require("fs");
const path = require("path");
const { resolve } = path;

export const getMsg = (path = resolve(__dirname, "../../article")) => {
  let res = fs.readdirSync(path);
  if (res) {
    let arr = res.map((item) => {
      if (String(item).endsWith(".md")) {
        return { text: item.split(".")[0], link: resolve(path, item) };
      } else {
        return {
          text: item.split(".")[0],
          children: getMsg(resolve(path, item)),
        };
      }
    });
    arr = arr.map((item) => {
      if (item.link) {
        item.link = translateDir(item.link);
      }
      return item;
    });
    return arr;
  } else {
    console.warn("无文章");
  }
};

/**
 * 提取文件名
 * @param {string} path 
 */
function translateDir(path) {
  return path.replace(/\\/g, "/").split("docs")[1].split(".")[0];
}