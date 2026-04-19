const path = require("path");
const OSS = require("ali-oss");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const client = new OSS({
  region: "oss-cn-beijing",
  accessKeyId: process.env.OSS_ACCESS_KEY_ID,
  accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
  authorizationV4: true,
  bucket: "ttms-img",
});

// 上传文件，接收 Buffer，返回可访问的 URL
async function uploadFile(key, buffer) {
  const headers = {
    "x-oss-storage-class": "Standard",
    "x-oss-object-acl": "public-read", // 必须是 public-read，否则 URL 无法直接访问
  };
  const result = await client.put(key, buffer, { headers });
  return result.url; // 直接返回 URL 字符串
}

module.exports = {
  uploadFile,
};
