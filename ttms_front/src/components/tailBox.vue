<script setup></script>

<template>
  <div class="tailBox">
    <div class="footer-content">
      <p>
        <a href="#">关于猫眼</a> | <a href="#">关于我们</a> |
        <a href="#">董事会成员</a> | <a href="#">投资者关系</a> |
        <a href="#">美团网</a> | <a href="#">格瓦拉</a> |
        <a href="#">美团下载</a> |
        <a href="#">欢喜首映</a>
      </p>
      <p>
        商务合作邮箱：<a href="mailto:v@maoyan.com">v@maoyan.com</a>
        客服电话：10105335
        违法和不良信息/涉未成年人有害信息举报电话：4006018900<br />
        用户举报/涉未成年人有害信息举报邮箱：<a
          href="mailto:tousujubao@meituan.com"
          >tousujubao@meituan.com</a
        >
        舞弊线索举报邮箱：<a href="mailto:wubijubao@maoyan.com"
          >wubijubao@maoyan.com</a
        ><br />
        中华人民共和国增值电信业务经营许可证 京B2-20190350 | 营业性演出许可证
        京演（机构）（2019）4094号<br />
        广播电视节目制作经营许可证（京）字第08478号 | 网络文化经营许可证
        京网文（2022）1334-041号<br />
        艺术品经营单位备案证书 京京东艺（2022）0095号<br />
        猫眼用户服务协议 | 猫眼平台交易规则总则 | 隐私政策<br />
        京公网安备 11010102003232号 | 京ICP备16022489号-1<br />
        北京猫眼文化传媒有限公司<br />
        ©2024 猫眼电影 <a href="https://www.maoyan.com">www.maoyan.com</a>
      </p>
      <div class="footer-icons"></div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}
.tailBox {
  background-color: #ececec;
  color: white;
  padding: 20px 0;
  text-align: center;

  .footer-content {
    max-width: 800px;
    margin: 0 auto;
    color: black;
  }

  .footer-content a {
    color: #ff4081;
    text-decoration: none;
  }

  .footer-content a:hover {
    text-decoration: underline;
  }

  .footer-content p {
    margin: 10px 0;
    line-height: 1.6;
  }

  .footer-icons img {
    width: 50px;
    height: auto;
    margin: 0 10px;
    vertical-align: middle;
  }
}
</style>
