const path = require("path");
const OSS = require("ali-oss");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

async function main() {
  const bucketName = "ttms-img";

  const client = new OSS({
    region: "oss-cn-beijing",
    accessKeyId: process.env.OSS_ACCESS_KEY_ID,
    accessKeySecret: process.env.OSS_ACCESS_KEY_SECRET,
    authorizationV4: true,
  });

  try {
    // 设置存储空间 ACL 为私有
    // 可选值: 'private', 'public-read', 'public-read-write'
    await client.putBucketACL(bucketName, "public-read");
    console.log("设置 Bucket ACL 成功");

    // 获取存储空间 ACL
    const result = await client.getBucketACL(bucketName);
    console.log(`当前 Bucket ACL: ${result.acl}`);
  } catch (err) {
    console.error("操作失败:", err.message);
  }
}

main();
