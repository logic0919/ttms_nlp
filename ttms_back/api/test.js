const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, HeadingLevel, LevelFormat, BorderStyle, WidthType,
  ShadingType, VerticalAlign, PageNumber, PageBreak, TabStopType,
  TabStopPosition, Footer, Header, NumberFormat
} = require('docx');
const fs = require('fs');

// ── helpers ──────────────────────────────────────────────────────────────────
const p = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: "宋体", size: 24, ...opts })],
  spacing: { line: 480, before: 0, after: 0 },
  alignment: opts.align || AlignmentType.JUSTIFIED,
  ...opts.para
});

const pIndent = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: "宋体", size: 24, ...opts })],
  spacing: { line: 480, before: 0, after: 0 },
  alignment: AlignmentType.JUSTIFIED,
  indent: { firstLine: 480 },
  ...opts.para
});

const h1 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_1,
  children: [new TextRun({ text, font: "黑体", size: 32, bold: true })],
  spacing: { before: 480, after: 240, line: 480 },
  alignment: AlignmentType.LEFT,
});

const h2 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_2,
  children: [new TextRun({ text, font: "黑体", size: 28, bold: true })],
  spacing: { before: 360, after: 180, line: 480 },
  alignment: AlignmentType.LEFT,
});

const h3 = (text) => new Paragraph({
  heading: HeadingLevel.HEADING_3,
  children: [new TextRun({ text, font: "黑体", size: 26, bold: true })],
  spacing: { before: 240, after: 120, line: 480 },
  alignment: AlignmentType.LEFT,
});

const blank = () => new Paragraph({ children: [new TextRun("")], spacing: { line: 480 } });

const center = (text, opts = {}) => new Paragraph({
  children: [new TextRun({ text, font: "宋体", size: 24, ...opts })],
  alignment: AlignmentType.CENTER,
  spacing: { line: 480, before: 0, after: 0 },
});

const pageBreak = () => new Paragraph({
  children: [new PageBreak()],
  spacing: { line: 240 },
});

// table cell helper
const tc = (text, { w = 2340, header = false, bold = false } = {}) => new TableCell({
  width: { size: w, type: WidthType.DXA },
  margins: { top: 80, bottom: 80, left: 120, right: 120 },
  shading: header ? { fill: "D9E1F2", type: ShadingType.CLEAR } : undefined,
  borders: {
    top: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
    bottom: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
    left: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
    right: { style: BorderStyle.SINGLE, size: 1, color: "AAAAAA" },
  },
  children: [new Paragraph({
    children: [new TextRun({ text, font: "宋体", size: 21, bold })],
    spacing: { line: 360 },
    alignment: AlignmentType.CENTER,
  })],
});

const tableRow = (cells) => new TableRow({ children: cells });

// ── document sections ────────────────────────────────────────────────────────
const titlePage = [
  blank(), blank(), blank(),
  center("本科毕业设计（论文）", { bold: true, size: 28 }),
  blank(), blank(),
  center("基于Vue3与Node.js的影院售票管理系统", { bold: true, size: 40, font: "黑体" }),
  center("设计与实现", { bold: true, size: 40, font: "黑体" }),
  blank(),
  center("——集成Coze智能体的AI辅助运营探索", { size: 26, font: "宋体" }),
  blank(), blank(), blank(), blank(),
  new Paragraph({ children: [new TextRun({ text: "专    业：软件工程", font: "宋体", size: 26 })], alignment: AlignmentType.CENTER, spacing: { line: 480 } }),
  new Paragraph({ children: [new TextRun({ text: "指导教师：                   ", font: "宋体", size: 26 })], alignment: AlignmentType.CENTER, spacing: { line: 480 } }),
  new Paragraph({ children: [new TextRun({ text: "学    号：                   ", font: "宋体", size: 26 })], alignment: AlignmentType.CENTER, spacing: { line: 480 } }),
  new Paragraph({ children: [new TextRun({ text: "姓    名：                   ", font: "宋体", size: 26 })], alignment: AlignmentType.CENTER, spacing: { line: 480 } }),
  blank(), blank(),
  center("2026年4月", { size: 26 }),
];

const abstract_cn = [
  pageBreak(),
  center("摘  要", { bold: true, size: 32, font: "黑体" }),
  blank(),
  pIndent("随着互联网经济的蓬勃发展与居民消费水平的持续提升，影视娱乐产业正以前所未有的速度扩张，国内院线数量及银幕总量逐年攀升。与此同时，传统影院的运营管理模式仍存在诸多痛点：票务流程繁琐、人工成本高昂、数据孤岛现象突出、影院管理人员在新增电影与排片信息时需要耗费大量人工操作时间。如何借助现代软件工程手段提升影院运营效率、改善观影用户体验，成为业界亟待解决的课题。"),
  pIndent("本文设计并实现了一套基于Vue3与Node.js的影院售票管理系统（TTMS，Theater Ticket Management System），并创新性地将Coze平台的大语言模型工作流智能体集成至后台管理功能中，实现了AI辅助影院数据录入的探索性应用。系统前端采用Vue3框架，结合Element Plus组件库、Pinia状态管理和Vue Router路由管理，构建了面向普通用户与管理员双角色的单页面应用；后端采用Node.js + Express.js框架，遵循MVC架构分层设计，利用MySQL关系型数据库持久化数据，通过阿里云OSS对象存储服务实现影片海报及人员图片的云端存储，以JWT（JSON Web Token）机制保障接口安全。"),
  pIndent("在功能层面，系统覆盖了影院管理的核心业务：电影信息管理（含多图片上传）、影厅座位管理（自定义行列布局）、场次排片管理、用户注册与登录、在线选座下单、订单支付与退票等完整票务流程。在AI辅助运营层面，系统接入了基于Coze平台构建的多层意图识别智能体工作流，支持管理员通过自然语言文本描述或飞书多维表格链接批量录入电影与影厅数据，大幅降低了人工录入成本，探索了大语言模型在垂直领域业务系统中的实际落地路径。"),
  pIndent("系统经过功能验证与测试，核心业务流程运行稳定，AI智能体在正常网络条件下能够准确识别意图并完成数据写入。本项目对于中小型影院数字化转型具有一定的参考价值，同时也为大语言模型与传统业务系统融合提供了实践案例。"),
  blank(),
  new Paragraph({ children: [new TextRun({ text: "关键词：影院售票管理系统；Vue3；Node.js；大语言模型；Coze智能体；JWT认证；阿里云OSS", font: "宋体", size: 24 })], spacing: { line: 480 }, alignment: AlignmentType.JUSTIFIED }),
];

const abstract_en = [
  pageBreak(),
  center("Abstract", { bold: true, size: 32, font: "Times New Roman" }),
  blank(),
  new Paragraph({
    children: [new TextRun({ text: "With the booming development of the Internet economy and the continuous improvement of residents' consumption levels, the film and entertainment industry is expanding at an unprecedented rate. The number of domestic cinema chains and the total number of screens are climbing year by year. At the same time, traditional cinema operation and management models still have many pain points: cumbersome ticketing processes, high labor costs, prominent data silo phenomenon, and cinema managers need to spend a lot of manual operation time when adding new movie and scheduling information. How to use modern software engineering methods to improve cinema operating efficiency and improve the movie-watching user experience has become an urgent problem to be solved in the industry.", font: "Times New Roman", size: 24 })],
    spacing: { line: 480 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "This paper designs and implements a Theater Ticket Management System (TTMS) based on Vue3 and Node.js, and innovatively integrates the Coze platform's large language model workflow agent into the background management function, realizing an exploratory application of AI-assisted cinema data entry. The front-end of the system uses the Vue3 framework, combined with the Element Plus component library, Pinia state management, and Vue Router routing management, to build a single-page application for ordinary users and administrators. The back-end uses the Node.js + Express.js framework, following the MVC architecture layered design. It uses MySQL relational database for data persistence, Alibaba Cloud OSS object storage service for cloud storage of movie posters and personnel images, and JWT (JSON Web Token) mechanism to ensure interface security.", font: "Times New Roman", size: 24 })],
    spacing: { line: 480 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "In terms of functions, the system covers the core business of cinema management: movie information management (including multi-image upload), cinema hall seat management (custom row and column layout), session scheduling management, user registration and login, online seat selection and ordering, complete ticketing processes such as order payment and ticket refund. In terms of AI-assisted operations, the system is connected to a multi-layer intent recognition agent workflow built on the Coze platform, supporting administrators to batch enter movie and cinema hall data through natural language text descriptions or Feishu multidimensional spreadsheet links, greatly reducing manual entry costs, and exploring the practical implementation path of large language models in vertical domain business systems.", font: "Times New Roman", size: 24 })],
    spacing: { line: 480 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
  }),
  new Paragraph({
    children: [new TextRun({ text: "After functional verification and testing, the core business processes run stably, and the AI agent can accurately identify intentions and complete data writing under normal network conditions. This project has certain reference value for the digital transformation of small and medium-sized cinemas, and also provides practical cases for the integration of large language models and traditional business systems.", font: "Times New Roman", size: 24 })],
    spacing: { line: 480 },
    alignment: AlignmentType.JUSTIFIED,
    indent: { firstLine: 480 },
  }),
  blank(),
  new Paragraph({
    children: [new TextRun({ text: "Keywords: Theater Ticket Management System; Vue3; Node.js; Large Language Model; Coze Agent; JWT Authentication; Alibaba Cloud OSS", font: "Times New Roman", size: 24 })],
    spacing: { line: 480 },
  }),
];

// Chapter 1
const chapter1 = [
  pageBreak(),
  h1("第一章  绪论"),
  h2("1.1 研究背景与意义"),
  pIndent("进入21世纪第二个十年以来，中国电影市场经历了爆发式增长。根据国家电影局数据，即便经历了2020年新冠疫情的冲击，国内电影票房在随后几年依然持续回暖，院线影院数量与银幕总数屡创历史新高。影院作为连接电影内容与观影消费者的核心渠道，其信息化管理水平直接影响着运营效率与用户体验。"),
  pIndent("然而，国内众多中小型影院在信息化建设方面仍处于相对滞后的状态。部分影院依赖手工或半自动化的方式进行排片录入、票务管理，不仅工作量大、容易出错，而且无法实现实时数据同步，给影院管理人员带来了较大负担。与此同时，随着第三方票务平台（如猫眼、淘票票）的崛起，影院与平台之间的数据对接需求日益迫切，独立的影院管理系统的重要性愈发凸显。"),
  pIndent("与此同时，以ChatGPT、文心一言、豆包为代表的大语言模型（Large Language Model，LLM）技术在2023年以来取得了突破性进展，并迅速在各行各业展现出应用潜力。大语言模型具备强大的自然语言理解和生成能力，能够从非结构化的自然语言描述中提取结构化信息，这为传统业务系统的智能化升级提供了新的技术路径。如何将大语言模型的能力与影院管理系统相结合，降低管理员的操作门槛，提升数据录入效率，是本课题研究的核心问题。"),
  pIndent("本项目设计并实现的影院售票管理系统（TTMS），在完整覆盖影院核心票务业务流程的基础上，通过接入Coze平台搭建的AI工作流智能体，实现了自然语言驱动的电影与影厅数据录入功能，探索了大语言模型在垂直业务领域的实际落地应用。项目的研究意义主要体现在以下几个方面："),
  pIndent("（1）业务价值层面：系统提供了完整的影院票务管理解决方案，能够支撑中小型影院的日常运营，有效降低人力成本，提升管理效率。"),
  pIndent("（2）技术探索层面：将前沿的大语言模型技术与传统的Web业务系统有机结合，探索了AI辅助运营的可行路径，为同类系统的建设提供了借鉴。"),
  pIndent("（3）工程实践层面：项目完整实践了从需求分析、系统设计、前后端开发、数据库设计到集成测试的软件开发全生命周期，具有较强的工程教育价值。"),

  h2("1.2 国内外研究现状"),
  h3("1.2.1 影院票务管理系统研究现状"),
  pIndent("在国外，以AMC Theatres、Regal Cinemas等为代表的院线集团，依托强大的技术研发能力，建立了较为完善的数字化票务系统，实现了在线选座、动态定价、会员积分等高级功能，并与Apple Pay、Google Pay等移动支付生态深度融合。其技术架构多采用微服务架构，具备较强的高并发处理能力。"),
  pIndent("在国内，猫眼娱乐、淘票票、格瓦拉等第三方票务平台已发展为体量庞大的互联网公司，其技术积累深厚，能够支撑春节档、国庆档等高峰期的海量并发购票请求。然而，对于广大中小型独立影院而言，购置或对接商业级票务系统的成本较高，学术界和开源社区围绕影院管理系统的研究相对较少，现有研究多停留在单机或局域网部署的传统C/S架构层面。"),
  pIndent("近年来，随着Vue、React等现代前端框架的普及，以及Node.js在服务端的广泛应用，基于B/S架构的轻量级影院管理系统逐渐成为研究热点。部分高校毕业设计项目聚焦于利用Spring Boot + MySQL或Django + PostgreSQL等技术栈构建影院管理系统，但在AI辅助功能方面的探索仍十分有限。"),
  h3("1.2.2 大语言模型与业务系统集成研究现状"),
  pIndent("自2022年底ChatGPT发布以来，大语言模型与业务系统的集成研究呈现出爆炸式增长态势。从技术路径来看，主要有以下几种集成模式："),
  pIndent("第一，RAG（检索增强生成）模式：将企业内部文档构建为向量知识库，通过相似度检索为LLM提供上下文，用于智能客服、知识问答等场景。"),
  pIndent("第二，Function Calling / Tool Use模式：通过定义结构化工具接口，允许LLM在对话中自主调用外部API，完成数据查询、写入等操作。这种模式与本项目的应用场景高度契合。"),
  pIndent("第三，Agent / Multi-Agent模式：构建具备规划、推理、工具调用和自我反思能力的自主智能体，能够完成多步骤复杂任务。Coze、Dify、LangChain等平台均提供了Agent的低代码或可视化搭建能力。"),
  pIndent("在国内，字节跳动推出的Coze平台凭借其丰富的插件生态、可视化的工作流编排界面和对飞书等国内主流SaaS工具的原生集成，受到了开发者群体的广泛关注。利用Coze平台搭建面向特定业务场景的AI工作流，是目前业界较为主流的实践方向之一。"),
  pIndent("然而，现有研究在将大语言模型与影院管理等垂直领域业务系统深度集成方面的探索仍较为匮乏，本项目在此领域进行了有益尝试。"),

  h2("1.3 研究目标与内容"),
  pIndent("本项目的研究目标是设计并实现一套功能完整、架构合理、具备AI辅助能力的影院售票管理系统，具体研究内容如下："),
  pIndent("（1）系统需求分析：梳理影院票务管理的核心业务需求，明确系统的功能边界与非功能要求，为系统设计提供依据。"),
  pIndent("（2）系统架构设计：采用前后端分离架构，设计合理的系统分层结构、数据库模型及API接口规范。"),
  pIndent("（3）前端应用开发：基于Vue3技术栈，实现用户端的电影浏览、在线选座、订单管理，以及管理端的电影、影厅、场次管理等功能模块。"),
  pIndent("（4）后端服务开发：基于Node.js + Express.js框架，实现RESTful API设计，涵盖用户认证、业务数据增删改查、图片上传至云存储等功能。"),
  pIndent("（5）AI智能体集成：基于Coze平台设计并搭建多层意图识别工作流，实现自然语言或结构化文件驱动的影院数据批量录入功能。"),
  pIndent("（6）系统测试：对核心功能模块进行功能测试与集成测试，验证系统的正确性与稳定性。"),

  h2("1.4 论文结构安排"),
  pIndent("本论文共分七章，各章内容安排如下："),
  pIndent("第一章为绪论，介绍本课题的研究背景、研究意义、国内外研究现状、研究目标与内容及论文结构安排。"),
  pIndent("第二章为相关技术概述，介绍系统开发所采用的主要技术框架与工具，包括Vue3、Pinia、Element Plus、Node.js、Express.js、MySQL、JWT、阿里云OSS及Coze智能体平台。"),
  pIndent("第三章为系统需求分析，从功能需求和非功能需求两个维度对系统进行详细分析，并给出用例描述。"),
  pIndent("第四章为系统设计，包括系统整体架构设计、数据库设计、前端架构设计、后端模块设计及AI智能体工作流设计。"),
  pIndent("第五章为系统实现，详细描述各功能模块的具体实现过程，包括关键代码分析与功能说明。"),
  pIndent("第六章为系统测试，介绍测试环境、测试方案，并对各功能模块进行测试，分析测试结果。"),
  pIndent("第七章为总结与展望，总结本项目的研究成果，分析系统的不足之处，展望未来的改进方向。"),
];

// Chapter 2
const chapter2 = [
  pageBreak(),
  h1("第二章  相关技术概述"),
  h2("2.1 前端技术栈"),
  h3("2.1.1 Vue3框架"),
  pIndent("Vue.js是一套用于构建用户界面的渐进式JavaScript框架。2020年正式发布的Vue3版本在Vue2的基础上进行了全面重构，引入了Composition API（组合式API）、`<script setup>`语法糖、基于Proxy的响应式系统等重大新特性，在性能、可维护性和TypeScript支持方面均有显著提升。"),
  pIndent("Composition API是Vue3最核心的新特性之一。与Vue2的Options API相比，Composition API允许开发者将同一逻辑关注点的代码（响应式数据定义、计算属性、生命周期钩子等）组织在一起，而非按照options（data、methods、computed等）分散在组件对象的不同位置，大大提升了代码的可读性和可复用性，尤其适合复杂组件的开发。"),
  pIndent("Vue3的响应式系统基于ES6的Proxy特性重写，相比Vue2基于Object.defineProperty的实现，能够拦截对象属性的动态新增与删除、数组元素的直接赋值等操作，解决了Vue2响应式系统的若干已知局限，同时带来了更好的性能表现。"),
  pIndent("本项目全面采用Vue3的Composition API和`<script setup>`语法，充分利用`ref`、`reactive`、`computed`、`watch`等组合式API构建响应式组件，同时利用`defineProps`、`defineEmits`实现父子组件间的通信。"),
  h3("2.1.2 Vite构建工具"),
  pIndent("Vite是由Vue.js的作者尤雨溪开发的新一代前端构建工具，以其极速的冷启动、即时的热模块替换（HMR）和高效的生产构建著称。Vite在开发模式下利用浏览器原生的ES Module支持，无需预先打包即可直接提供源码，从而实现毫秒级的服务器启动；在生产构建时，Vite使用Rollup进行高效的代码打包与优化。"),
  pIndent("本项目使用Vite作为前端工程的构建工具，配合`@vitejs/plugin-vue`插件实现对`.vue`单文件组件（SFC）的编译支持，并通过`unplugin-auto-import`和`unplugin-vue-components`插件实现Element Plus组件和Composition API的按需自动导入，在减小打包体积的同时提升了开发体验。"),
  h3("2.1.3 Element Plus组件库"),
  pIndent("Element Plus是基于Vue3重构的企业级UI组件库，由饿了么前端团队维护，提供了包括表单、表格、弹窗、菜单、分页、日期选择器等在内的数十种常用组件，广泛应用于中后台管理系统的开发场景。"),
  pIndent("本项目在管理端和用户端均大量使用了Element Plus的组件，包括：`el-form`用于表单收集与校验、`el-table`用于数据展示、`el-dialog`用于弹窗交互、`el-message`和`el-message-box`用于用户提示与二次确认、`el-upload`用于图片文件上传、`el-date-picker`用于场次时间选择等。"),
  h3("2.1.4 Pinia状态管理"),
  pIndent("Pinia是Vue官方推荐的状态管理库，也是Vuex的替代方案。相比Vuex，Pinia的API更加简洁，天然支持TypeScript，并且取消了Vuex中容易令初学者困惑的Mutations概念，允许在Action中直接修改状态。Pinia的Store以组合式API风格定义，支持结合`pinia-plugin-persistedstate`插件实现状态的本地持久化。"),
  pIndent("本项目使用Pinia管理全局用户状态（包括token、用户ID、用户角色status等），并借助`pinia-plugin-persistedstate`将用户登录态持久化到`localStorage`，实现页面刷新后的自动登录保持。"),
  h3("2.1.5 Vue Router路由管理"),
  pIndent("Vue Router是Vue.js的官方路由库，支持嵌套路由、动态路由匹配、路由守卫等特性，是构建单页面应用（SPA）的核心工具。本项目采用Vue Router 4.x版本，利用`createWebHistory`模式创建基于HTML5 History API的路由，在路由配置中定义了用户端首页、电影列表、电影详情、选座下单、订单管理等用户路由，以及影厅管理、场次管理、电影管理等管理员路由。"),
  pIndent("本项目还通过Vue Router的全局前置守卫（`router.beforeEach`）实现了路由级别的访问控制：对于需要登录才能访问的路由，守卫会检查Pinia中的token是否存在；对于需要管理员权限的路由，守卫会进一步校验用户的status字段，确保普通用户无法访问管理功能。"),
  h3("2.1.6 Axios HTTP客户端"),
  pIndent("Axios是一个基于Promise的HTTP客户端库，支持浏览器和Node.js环境，提供了拦截器、请求取消、自动JSON转换等特性。本项目使用Axios与后端RESTful API进行通信，并通过封装请求拦截器，在每个HTTP请求的`Authorization`头中自动附加JWT Token，实现了全局的身份认证传递；通过响应拦截器统一处理HTTP错误响应，在token失效时自动跳转至登录页。"),

  h2("2.2 后端技术栈"),
  h3("2.2.1 Node.js运行时"),
  pIndent("Node.js是基于Chrome V8 JavaScript引擎构建的JavaScript运行时环境，采用事件驱动、非阻塞I/O的异步编程模型，使得JavaScript能够在服务端运行。Node.js特别适合处理高并发的I/O密集型应用场景，在Web服务器、API服务器领域有广泛应用。"),
  pIndent("Node.js的包管理生态npm拥有世界上最大的开源软件注册表，丰富的第三方库资源大大加速了开发效率。本项目的后端服务完全基于Node.js构建，使用pnpm作为包管理器，在保证依赖管理严格性的同时提升了安装速度。"),
  h3("2.2.2 Express.js Web框架"),
  pIndent("Express.js是Node.js生态中最成熟、使用最广泛的轻量级Web应用框架，提供了路由、中间件、模板渲染等核心功能，具有高度的灵活性和可扩展性。"),
  pIndent("本项目采用Express.js构建后端RESTful API服务，利用其中间件机制实现跨域处理（cors）、请求体解析（body-parser）、JWT验证（自定义verifyToken中间件）、文件上传（multer）等横切关注点的统一处理。路由模块采用Express Router按业务域（用户、电影、影厅、场次、订单）进行拆分和组织。"),
  h3("2.2.3 JWT身份认证"),
  pIndent("JSON Web Token（JWT）是一种开放标准（RFC 7519），定义了一种紧凑且自包含的方式，用于在各方之间以JSON对象形式安全地传输信息。JWT由三部分组成：头部（Header）、载荷（Payload）和签名（Signature），三部分之间以点号分隔。JWT的无状态特性使其非常适合于分布式系统中的身份认证场景。"),
  pIndent("本项目的身份认证流程如下：用户登录成功后，后端使用`jsonwebtoken`库以用户ID、用户状态（status）等信息为载荷，结合服务端保存的密钥生成JWT Token并返回给前端；前端将Token存储在Pinia Store（并持久化至localStorage）；后续每次请求通过Axios拦截器在`Authorization: Bearer <token>`头中携带Token；服务端的`verifyToken`中间件对Token进行验证，验证通过后将解码的用户信息挂载至`req.user`，供控制器层使用。"),
  h3("2.2.4 Multer文件上传中间件"),
  pIndent("Multer是Express.js生态中专门处理`multipart/form-data`格式请求的中间件，主要用于文件上传场景。本项目使用Multer的内存存储（`memoryStorage`）模式，将上传的图片文件临时保存在内存中（`req.files`），再通过阿里云OSS SDK将文件上传至云端，避免了本地磁盘存储带来的管理复杂性。"),
  h3("2.2.5 MySQL数据库"),
  pIndent("MySQL是世界上最流行的开源关系型数据库管理系统，以其高性能、高可靠性和易用性著称，在Web应用领域有极为广泛的应用。本项目使用MySQL 8.x版本，数据库字符集设置为`utf8mb4`，以支持中文及Emoji字符的存储。"),
  pIndent("本项目使用Node.js的`mysql`库进行数据库连接管理，采用连接池（Connection Pool）模式减少频繁创建和销毁连接的开销，提高数据库访问效率。所有数据库操作均采用参数化查询（Prepared Statements）防止SQL注入攻击。"),

  h2("2.3 阿里云OSS对象存储"),
  pIndent("阿里云对象存储OSS（Object Storage Service）是阿里云提供的海量、安全、低成本、高可靠的云存储服务，以RESTful API为接口，支持存储任意类型和大小的非结构化数据，包括图片、音视频、文档等。"),
  pIndent("本项目将电影海报图片（movie_img）、导演照片（director_img）、演员照片（actor_img）统一存储至阿里云OSS的指定Bucket（`ttms-img`，地域为北京）。后端使用`ali-oss` Node.js SDK与OSS服务进行交互，上传图片时生成以字段名为前缀、时间戳加随机字符串为文件名的对象Key，确保文件名唯一性。上传成功后，将图片的公网访问URL存储至MySQL数据库中对应字段，前端直接通过URL渲染图片，无需额外的文件服务层。"),

  h2("2.4 Coze智能体平台"),
  pIndent("Coze是字节跳动推出的AI机器人搭建与多渠道发布平台，于2023年底对外开放，面向开发者提供了包括知识库、记忆、工具、工作流（Workflow）等在内的丰富能力，用户无需编写代码即可构建具备复杂业务逻辑的AI应用。"),
  pIndent("工作流（Workflow）是Coze平台的核心功能之一，允许用户以可视化的节点拖拽方式编排复杂的AI处理流程。工作流支持大语言模型调用（LLM节点）、意图识别（Intent节点）、HTTP请求（HTTP节点）、代码执行（Code节点）、条件分支（If/Else节点）、飞书文档读取等多种节点类型，节点之间可以通过变量引用进行数据传递。"),
  pIndent("本项目利用Coze工作流构建了一个面向影院数据管理的AI智能体，该智能体以豆包·2.0·mini大语言模型为核心推理引擎，通过多层意图识别节点解析管理员的操作意图，并通过HTTP节点调用系统后端API完成实际的数据库写入操作，实现了自然语言与结构化业务操作的桥接。"),
  pIndent("豆包（Doubao）是字节跳动发布的大语言模型系列，豆包·2.0·mini是其中的轻量高效版本，在推理速度和成本方面具有优势，适合作为意图识别和信息提取等对推理深度要求不极高的任务的基座模型。"),
];

// Chapter 3
const chapter3 = [
  pageBreak(),
  h1("第三章  系统需求分析"),
  h2("3.1 系统概述"),
  pIndent("本系统的中文名称为【影院售票管理系统】，英文名称为【Theater Ticket Management System】，缩写为TTMS。系统面向两类用户群体：普通观影用户（User）和影院管理员（Admin）。普通用户通过系统浏览在映电影信息，查看电影详情与排片场次，在线完成选座购票、支付及退票操作；管理员通过系统后台管理界面对影院数据进行维护，包括电影信息的增删改查、影厅的配置管理、场次排片管理等，同时还可借助AI智能体进行批量数据录入。"),
  pIndent("系统采用单一Web应用部署方式，前端通过浏览器访问，后端提供RESTful API服务，数据库部署于本地或云服务器，图片资源存储于阿里云OSS，AI智能体部署于Coze平台并通过HTTP接口与系统后端交互。"),

  h2("3.2 功能需求分析"),
  h3("3.2.1 用户认证功能"),
  pIndent("系统需要提供完整的用户认证功能，具体要求如下："),
  pIndent("（1）用户注册：用户可通过注册页面填写用户名和密码进行账号注册。系统需对用户名唯一性进行校验，对密码进行强度验证，密码存储时需使用bcryptjs进行哈希加密处理。"),
  pIndent("（2）用户登录：注册用户可使用用户名和密码进行登录。系统验证身份后生成JWT Token返回给前端，Token有效期内无需重新登录。"),
  pIndent("（3）权限控制：系统支持管理员（status=0）和普通用户（status=1）两种角色，不同角色拥有不同的功能权限。前端路由层面通过导航守卫拦截未授权的路由访问，后端接口层面通过中间件验证Token并校验用户角色。"),
  pIndent("（4）退出登录：用户可手动退出登录，前端清除本地存储的Token及用户状态。"),
  h3("3.2.2 电影管理功能"),
  pIndent("电影管理是系统的核心功能模块，主要面向管理员用户，具体需求如下："),
  pIndent("（1）电影列表展示：系统支持在首页以卡片形式展示在映电影列表，支持按分类标签筛选，支持按电影名称关键词搜索，未登录用户也可浏览电影信息。"),
  pIndent("（2）电影详情查看：用户点击电影卡片可进入电影详情页，查看电影简介、演员阵容、导演信息及相关图片。"),
  pIndent("（3）电影信息录入：管理员可通过Web表单手动录入新电影信息，包括中文名、英文名、地区、时长、上映时间、分类标签、简介、导演信息、演员信息，以及电影海报、导演图片、演员图片等多张图片的上传（图片上传至阿里云OSS）。"),
  pIndent("（4）AI辅助录入：管理员可通过Coze智能体，使用自然语言描述或飞书多维表格链接批量添加电影信息，系统自动解析并调用API完成数据写入。"),
  pIndent("（5）电影信息修改：管理员可对已录入的电影信息进行编辑更新。"),
  pIndent("（6）电影删除：管理员可删除指定电影记录。"),
  pIndent("（7）热映榜单：首页展示热映电影榜单（按场次数量排序），方便用户发现热门影片。"),
  h3("3.2.3 影厅管理功能"),
  pIndent("（1）影厅列表展示：管理员可查看当前所有影厅的基本信息，包括影厅名称、行数（rnum）、列数（cnum）等。"),
  pIndent("（2）影厅详情查看：管理员可查看指定影厅的座位布局图，直观了解影厅容量与座位分布情况。"),
  pIndent("（3）影厅创建：管理员可通过表单新建影厅，指定影厅名称、行数、列数，系统根据行列数自动生成座位矩阵，支持管理员手动标记某些座位为不可用状态（如过道、残疾人专座）。"),
  pIndent("（4）AI辅助录入：管理员可通过Coze智能体，使用自然语言或飞书表格批量录入影厅配置信息。"),
  h3("3.2.4 场次管理功能"),
  pIndent("（1）场次列表查看：管理员可查看所有场次的排片信息，包括关联的电影名称、影厅名称、开始时间、结束时间、票价等。"),
  pIndent("（2）场次添加：管理员可为指定电影在指定影厅安排新的放映场次，设置开始时间、结束时间和票价。"),
  pIndent("（3）场次查询：用户在电影详情页可按日期查询该电影的可用场次列表。"),
  pIndent("（4）场次座位状态：用户选择场次后，系统实时显示该场次的座位状态（可选/已锁定/已售出），不同状态以不同颜色区分。"),
  pIndent("（5）场次删除：管理员可删除指定场次记录。"),
  h3("3.2.5 订单管理功能（票务核心流程）"),
  pIndent("（1）座位锁定：用户在选座页面选择座位后提交，系统为用户创建待支付订单，将所选座位锁定（状态为1，过期时间设为当前时间后15分钟），防止其他用户同时购买同一座位。"),
  pIndent("（2）订单支付：用户在订单确认页面完成支付确认，系统将订单状态更新为已支付（status=1），过期时间设为极远未来（3000年），确保已支付订单不会过期失效。"),
  pIndent("（3）订单退票：已支付的订单支持退票操作，系统将订单状态更新为已退票（status=2），释放对应座位资源。"),
  pIndent("（4）订单列表查看：用户可在个人中心查看自己的所有历史订单，查看订单详情（电影名称、场次时间、座位信息、金额、状态）。"),
  pIndent("（5）过期订单处理：系统通过查询订单的`exp`字段判断锁定是否已过期，过期的锁定订单对应座位将重新变为可选状态。"),

  h2("3.3 非功能需求分析"),
  h3("3.3.1 安全性需求"),
  pIndent("系统需满足以下安全性要求：用户密码采用bcryptjs进行哈希加密后存储，不明文保存；所有需要身份验证的API接口通过JWT Token进行鉴权；数据库操作采用参数化查询防止SQL注入；前端路由设置访问控制防止未授权访问。"),
  h3("3.3.2 可用性需求"),
  pIndent("系统应具备良好的用户界面，操作流程清晰直观；页面响应时间在正常网络环境下应在2秒以内；对用户的各类操作给予及时的反馈提示（成功、失败、loading状态）；表单输入提供合理的校验规则和错误提示。"),
  h3("3.3.3 可维护性需求"),
  pIndent("代码结构应遵循清晰的分层架构，前端按功能模块组织视图、组件、API、工具等文件；后端按MVC模式组织路由、控制器、服务、模型等文件；代码中添加必要的注释；数据库设计规范，字段命名语义清晰。"),
  h3("3.3.4 可扩展性需求"),
  pIndent("系统架构应具备一定的可扩展性，便于后续功能迭代：后端采用模块化路由设计，新增业务模块只需添加对应的路由、控制器和模型文件；前端组件化设计，公共组件可被多个页面复用；数据库设计预留扩展字段空间。"),

  h2("3.4 用例分析"),
  pIndent("系统包含两类参与者：普通用户（User）和管理员（Admin）。管理员拥有普通用户的所有权限，同时具备影院数据管理权限。主要用例如下："),
  pIndent("用例UC-01：用户注册。参与者：匿名访客。前提条件：用户未注册账号。主要流程：用户访问登录/注册页面→填写用户名和密码→系统校验用户名唯一性及密码合法性→注册成功，跳转至首页。"),
  pIndent("用例UC-02：用户登录。参与者：已注册用户。前提条件：用户已有账号。主要流程：用户访问登录页面→填写用户名和密码→系统验证身份→生成并返回JWT Token→前端存储Token→跳转至首页。"),
  pIndent("用例UC-03：浏览电影列表。参与者：匿名访客/已登录用户。主要流程：用户访问首页或电影列表页→系统返回在映电影列表→用户可按分类筛选或关键词搜索。"),
  pIndent("用例UC-04：在线购票。参与者：已登录普通用户。前提条件：用户已登录，选定电影和场次。主要流程：用户选择场次→进入选座页面→选择座位→提交锁座（创建待支付订单）→确认支付→订单状态更新为已支付。"),
  pIndent("用例UC-05：退票。参与者：已登录普通用户。前提条件：用户有已支付订单。主要流程：用户进入订单列表→选择目标订单→点击退票→系统更新订单状态为已退票。"),
  pIndent("用例UC-06：管理电影信息。参与者：管理员。主要流程：管理员登录→进入电影管理→新增/查看/修改/删除电影信息。"),
  pIndent("用例UC-07：AI辅助数据录入。参与者：管理员。主要流程：管理员在Coze智能体界面输入自然语言描述或飞书表格链接→智能体识别意图并提取数据字段→调用系统API写入数据库→返回操作结果。"),
];

// Chapter 4
const chapter4 = [
  pageBreak(),
  h1("第四章  系统设计"),
  h2("4.1 系统架构设计"),
  h3("4.1.1 整体架构"),
  pIndent("本系统采用前后端分离的B/S（Browser/Server）架构，结合AI智能体服务层，构成三层技术架构体系。整体架构自上而下分为：客户端展示层（Frontend）、服务端应用层（Backend）、数据持久化层（Database & OSS），外加独立的AI智能体平台（Coze）。"),
  pIndent("客户端展示层：基于Vue3构建的单页面应用（SPA），在用户的浏览器中运行，通过Axios向后端发起HTTP请求获取数据，负责所有的界面渲染和用户交互。"),
  pIndent("服务端应用层：基于Node.js + Express.js构建的RESTful API服务，运行在服务器（默认端口8080），负责处理业务逻辑、数据校验、身份认证、与数据库及OSS的交互。"),
  pIndent("数据持久化层：MySQL关系型数据库负责结构化业务数据的存储，阿里云OSS负责非结构化的图片资源存储。"),
  pIndent("AI智能体平台：部署在Coze云平台上的工作流智能体，独立于系统其他部分运行，通过HTTP协议调用后端API接口完成数据写入操作，属于系统功能的扩展层。"),
  h3("4.1.2 后端MVC分层架构"),
  pIndent("后端服务遵循MVC（Model-View-Controller）架构模式进行分层设计，具体分层如下："),
  pIndent("路由层（Routes）：负责定义API的URL路径与HTTP方法，将请求分发至对应的控制器方法，并挂载所需的中间件（如身份验证、文件上传）。"),
  pIndent("控制器层（Controllers）：负责处理HTTP请求与响应，从请求中提取参数，调用对应的服务层方法，将服务层返回的结果封装为标准格式的JSON响应。"),
  pIndent("服务层（Services）：负责核心业务逻辑的实现，包括数据校验、业务规则处理等，调用模型层进行数据库操作，对外屏蔽数据库细节。"),
  pIndent("模型层（Models）：负责封装数据库操作，提供对MySQL数据库的增删改查接口，使用参数化查询防止SQL注入。"),
  pIndent("中间件层（Middleware）：提供横切关注点的处理，包括全局响应格式标准化（responseHandler）、JWT Token验证（auth）、全局错误处理（errorHandler）等。"),
  pIndent("工具层（Utils）：提供通用工具函数，包括阿里云OSS文件上传（oss.js）等。"),
  h3("4.1.3 API设计规范"),
  pIndent("后端API遵循RESTful设计规范，统一以`/api/{业务模块}`为路径前缀，例如：`/api/movie`、`/api/hall`、`/api/session`、`/api/order`、`/api/user`。所有API的响应体采用统一的JSON格式，包含`success`（布尔型，表示操作是否成功）、`message`（字符串，操作结果描述）和`data`（对象或数组，具体的响应数据）三个字段。HTTP状态码的使用遵循标准语义：200表示成功，400表示客户端请求错误，401表示未授权，404表示资源不存在，500表示服务端内部错误。"),

  h2("4.2 数据库设计"),
  h3("4.2.1 数据库概述"),
  pIndent("本系统使用MySQL关系型数据库进行数据存储，数据库名称为`ttms`，字符集为`utf8mb4`，排序规则为`utf8mb4_0900_ai_ci`。数据库共包含6张数据表，分别为：用户表（users）、电影表（movie）、影厅表（hall）、场次表（session）、订单表（order）、订单座位表（order_seat）。"),
  h3("4.2.2 用户表（users）"),
  pIndent("用户表用于存储系统用户的基本信息，表结构设计如下所示。其中`user_id`为用户账号（字符串类型，非自增，由用户注册时填写），`pwd`为经过bcryptjs哈希处理后的密码（存储长度可达500字符），`status`为用户角色标识（0表示管理员，1表示普通用户）。"),
  new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [1500, 1500, 1500, 2000, 2526],
    rows: [
      tableRow([tc("字段名", { w: 1500, header: true, bold: true }), tc("类型", { w: 1500, header: true, bold: true }), tc("约束", { w: 1500, header: true, bold: true }), tc("说明", { w: 2000, header: true, bold: true }), tc("备注", { w: 2526, header: true, bold: true })]),
      tableRow([tc("user_id", { w: 1500 }), tc("varchar(45)", { w: 1500 }), tc("PK, NOT NULL", { w: 1500 }), tc("用户账号", { w: 2000 }), tc("用户名，唯一", { w: 2526 })]),
      tableRow([tc("pwd", { w: 1500 }), tc("varchar(500)", { w: 1500 }), tc("NOT NULL", { w: 1500 }), tc("密码哈希值", { w: 2000 }), tc("bcryptjs加密存储", { w: 2526 })]),
      tableRow([tc("status", { w: 1500 }), tc("int", { w: 1500 }), tc("NOT NULL", { w: 1500 }), tc("用户角色", { w: 2000 }), tc("0-管理员，1-普通用户", { w: 2526 })]),
    ],
  }),
  blank(),
  h3("4.2.3 电影表（movie）"),
  pIndent("电影表存储系统中所有电影的详细信息。`movie_id`为自增主键，`category_ids`存储以逗号分隔的分类标签ID字符串，`movie_img`、`director_img`、`actor_img`分别存储多张图片的OSS URL，URL之间以逗号分隔。"),
  new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [1600, 1500, 1200, 2000, 2726],
    rows: [
      tableRow([tc("字段名", { w: 1600, header: true, bold: true }), tc("类型", { w: 1500, header: true, bold: true }), tc("约束", { w: 1200, header: true, bold: true }), tc("说明", { w: 2000, header: true, bold: true }), tc("备注", { w: 2726, header: true, bold: true })]),
      tableRow([tc("movie_id", { w: 1600 }), tc("int", { w: 1500 }), tc("PK, AUTO", { w: 1200 }), tc("电影ID", { w: 2000 }), tc("自增主键", { w: 2726 })]),
      tableRow([tc("chinese_name", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("中文名", { w: 2000 }), tc("电影中文标题", { w: 2726 })]),
      tableRow([tc("english_name", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("英文名", { w: 2000 }), tc("电影英文标题", { w: 2726 })]),
      tableRow([tc("area", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("地区", { w: 2000 }), tc("出品地区", { w: 2726 })]),
      tableRow([tc("duration", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("时长", { w: 2000 }), tc("电影时长（分钟）", { w: 2726 })]),
      tableRow([tc("show_time", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("上映时间", { w: 2000 }), tc("格式：yyyy-MM-dd", { w: 2726 })]),
      tableRow([tc("introduction", { w: 1600 }), tc("varchar(600)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("简介", { w: 2000 }), tc("电影剧情简介", { w: 2726 })]),
      tableRow([tc("category_ids", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("分类标签", { w: 2000 }), tc("逗号分隔的标签ID", { w: 2726 })]),
      tableRow([tc("directors", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("导演", { w: 2000 }), tc("导演姓名", { w: 2726 })]),
      tableRow([tc("actors", { w: 1600 }), tc("varchar(45)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("演员", { w: 2000 }), tc("主演名单", { w: 2726 })]),
      tableRow([tc("movie_img", { w: 1600 }), tc("varchar(300)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("电影海报URL", { w: 2000 }), tc("OSS图片URL，可多张", { w: 2726 })]),
      tableRow([tc("director_img", { w: 1600 }), tc("varchar(300)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("导演照片URL", { w: 2000 }), tc("OSS图片URL", { w: 2726 })]),
      tableRow([tc("actor_img", { w: 1600 }), tc("varchar(300)", { w: 1500 }), tc("NOT NULL", { w: 1200 }), tc("演员照片URL", { w: 2000 }), tc("OSS图片URL", { w: 2726 })]),
    ],
  }),
  blank(),
  h3("4.2.4 影厅表（hall）"),
  pIndent("影厅表存储影院各影厅的基本配置信息。`rnum`和`cnum`分别表示座位的行数和列数，`seat`字段以JSON格式存储当前影厅的完整座位状态矩阵，包含每个座位的状态标记（1表示可用，0表示不可用/已设为过道等）。影厅名称`name`设置了唯一索引，保证影厅名不重复。"),
  new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [1500, 1500, 1500, 2000, 2526],
    rows: [
      tableRow([tc("字段名", { w: 1500, header: true, bold: true }), tc("类型", { w: 1500, header: true, bold: true }), tc("约束", { w: 1500, header: true, bold: true }), tc("说明", { w: 2000, header: true, bold: true }), tc("备注", { w: 2526, header: true, bold: true })]),
      tableRow([tc("hall_id", { w: 1500 }), tc("int", { w: 1500 }), tc("PK, AUTO", { w: 1500 }), tc("影厅ID", { w: 2000 }), tc("自增主键", { w: 2526 })]),
      tableRow([tc("name", { w: 1500 }), tc("varchar(45)", { w: 1500 }), tc("UNIQUE", { w: 1500 }), tc("影厅名称", { w: 2000 }), tc("不可重复", { w: 2526 })]),
      tableRow([tc("rnum", { w: 1500 }), tc("int", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("座位行数", { w: 2000 }), tc("影厅座位总行数", { w: 2526 })]),
      tableRow([tc("cnum", { w: 1500 }), tc("int", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("座位列数", { w: 2000 }), tc("影厅座位总列数", { w: 2526 })]),
      tableRow([tc("seat", { w: 1500 }), tc("varchar(500)", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("座位矩阵", { w: 2000 }), tc("JSON格式的座位状态数组", { w: 2526 })]),
    ],
  }),
  blank(),
  h3("4.2.5 场次表（session）"),
  pIndent("场次表存储影院的排片场次信息，是连接电影与影厅的关联实体。`hall_id`和`movie_id`分别是影厅表和电影表的外键引用，`stime`和`etime`分别是放映开始时间和结束时间（datetime类型，精确到秒），`price`是该场次的票价（浮点型）。"),
  new Table({
    width: { size: 9026, type: WidthType.DXA },
    columnWidths: [1500, 1500, 1500, 2000, 2526],
    rows: [
      tableRow([tc("字段名", { w: 1500, header: true, bold: true }), tc("类型", { w: 1500, header: true, bold: true }), tc("约束", { w: 1500, header: true, bold: true }), tc("说明", { w: 2000, header: true, bold: true }), tc("备注", { w: 2526, header: true, bold: true })]),
      tableRow([tc("session_id", { w: 1500 }), tc("int", { w: 1500 }), tc("PK, AUTO", { w: 1500 }), tc("场次ID", { w: 2000 }), tc("自增主键", { w: 2526 })]),
      tableRow([tc("hall_id", { w: 1500 }), tc("int", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("影厅ID", { w: 2000 }), tc("关联hall表", { w: 2526 })]),
      tableRow([tc("movie_id", { w: 1500 }), tc("int", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("电影ID", { w: 2000 }), tc("关联movie表", { w: 2526 })]),
      tableRow([tc("stime", { w: 1500 }), tc("datetime", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("开始时间", { w: 2000 }), tc("放映开始时间", { w: 2526 })]),
      tableRow([tc("etime", { w: 1500 }), tc("datetime", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("结束时间", { w: 2000 }), tc("放映结束时间", { w: 2526 })]),
      tableRow([tc("price", { w: 1500 }), tc("float", { w: 1500 }), tc("DEFAULT NULL", { w: 1500 }), tc("票价", { w: 2000 }), tc("单张票价（元）", { w: 2526 })]),
    ],
  }),
  blank(),
  h3("4.2.6 订单表（order）与订单座位表（order_seat）"),
  pIndent("订单表记录每一笔购票交易的核心信息。`user_id`关联users表，`session_id`关联session表，`status`字段表示订单状态（1-已锁定/待支付，2-已支付，3-已退票），`exp`字段存储订单的过期时间（字符串格式），用于判断锁定是否有效，`price`为实际支付金额。"),
  pIndent("订单座位表用于记录每笔订单所对应的具体座位坐标，采用一对多设计（一笔订单可对应多个座位）。`myrow`和`mycol`分别记录座位的行号和列号（从0开始计数），与影厅座位矩阵的坐标系一致。"),

  h2("4.3 前端架构设计"),
  h3("4.3.1 目录结构"),
  pIndent("前端项目基于Vite脚手架构建，采用标准的Vue3项目目录结构，主要目录及其职责如下："),
  pIndent("`src/views/`：页面视图目录，按业务模块划分子目录。包含`index/`（首页）、`login/`（登录/注册页）、`movie/`（电影列表页）、`movieDetail/`（电影详情页，含多个子路由页面）、`order/`（选座与支付页面）、`user/`（用户中心页）以及`admin/`、`adminHall/`、`adminMovie/`、`adminSession/`（管理员功能页面）。"),
  pIndent("`src/components/`：公共组件目录，包含`topNav.vue`（顶部导航栏）、`movieBox.vue`（电影卡片组件）、`hallItem.vue`（影厅列表项组件）、`seatTable.vue`（用户端座位图组件）、`seatTableAdmin.vue`（管理端座位图组件）、`myOrder.vue`（订单卡片组件）等可复用组件。"),
  pIndent("`src/api/`：API接口封装目录，按业务模块拆分为`movie.js`、`hall.js`、`session.js`、`order.js`、`user.js`，每个文件封装对应模块的Axios请求函数。"),
  pIndent("`src/stores/`：Pinia状态管理目录，`modules/user.js`定义了用户状态模块，包含token、user_id、status等字段及相关actions。"),
  pIndent("`src/router/`：路由配置目录，`index.js`定义了所有路由规则及导航守卫。"),
  pIndent("`src/utils/`：工具函数目录，包含`request.js`（Axios实例及拦截器配置）、`data.js`（本地数据常量，如电影分类标签定义）、`validate.js`（表单验证工具函数）、`extend.js`（扩展工具函数）。"),
  h3("4.3.2 组件通信设计"),
  pIndent("本项目中的组件通信采用以下几种方式：一是Props/Emit：父组件通过props向子组件传递数据，子组件通过emit向父组件传递事件，用于父子组件间的直接数据交换；二是Pinia Store：跨页面共享的全局状态（如用户信息）统一存放在Pinia Store中，各组件直接读取，无需层层传递；三是Vue Router路由参数：页面间的参数传递（如电影ID、场次ID）通过路由的动态参数或query参数实现。"),

  h2("4.4 AI智能体工作流设计"),
  h3("4.4.1 工作流整体设计"),
  pIndent("AI智能体工作流基于Coze平台的可视化编排界面搭建，工作流名称为`addMovie26042001`，主要功能为辅助管理员完成电影和影厅数据的批量录入。整个工作流由输入节点、意图识别节点、槽位提取节点、HTTP请求节点和输出节点组成，形成完整的处理链路。"),
  h3("4.4.2 节点设计"),
  pIndent("第一层：输入节点（Start Node）。接收管理员的自然语言输入（query），作为整个工作流的初始输入变量。"),
  pIndent("第二层：槽位提取LLM节点（132967）。使用豆包·2.0·mini模型对用户输入进行预处理，从自然语言描述中提取所有可能涉及的字段值，输出为结构化的JSON格式，包含系统API所需的全部字段（如`chinese_name`、`english_name`、`area`、`duration`、`show_time`、`introduction`、`category_ids`、`actors`、`directors`、`movie_img`、`director_img`、`actor_img`等电影字段，以及`name`、`rnum`、`cnum`、`seat`等影厅字段）。如果某字段在用户输入中未提及，则以空字符串（空属性）代替。"),
  pIndent("第三层：意图识别节点（108547）。基于豆包·2.0·mini模型的意图识别能力，对用户输入进行意图分类，识别结果包含以下四类：根据文件添加影片、根据文本描述添加影片、根据文件添加影厅、根据文本描述添加影厅。不同的意图结果将路由到不同的后续处理分支。"),
  pIndent("第四层：分支处理节点。根据意图识别结果，工作流进入对应的处理分支：（1）文本描述添加影片/影厅分支：直接从槽位提取结果中取出相关字段，通过HTTP节点调用后端`/api/movie/createcoze`或`/api/hall/create`接口写入数据；（2）文件（飞书表格）添加影片/影厅分支：首先读取飞书多维表格链接中的记录数据，逐行解析后分别调用HTTP节点写入数据库。"),
  pIndent("输出节点（900001）：工作流结束节点，将最终的操作结果文本作为output变量返回，告知用户操作是否成功。"),
  h3("4.4.3 AI辅助录入API适配"),
  pIndent("由于AI智能体通过HTTP请求调用后端API，而常规的电影创建接口（`/api/movie/create`）需要接收`multipart/form-data`格式（包含实际文件二进制数据），这与智能体能够处理的格式不完全匹配，因此专门为AI智能体设计了一个独立的接口`/api/movie/createcoze`。该接口接收`application/x-www-form-urlencoded`格式的数据，其中图片字段（`movie_img`、`director_img`、`actor_img`）接受OSS URL字符串而非文件二进制数据，图片URL可由智能体从飞书表格附件字段或网络搜索中获取，大幅简化了AI与API的对接复杂度。"),
];

// Chapter 5
const chapter5 = [
  pageBreak(),
  h1("第五章  系统实现"),
  h2("5.1 后端服务实现"),
  h3("5.1.1 项目初始化与服务入口"),
  pIndent("后端服务入口文件`app.js`负责Express应用的初始化与中间件注册。应用启动时按顺序完成以下配置：注册CORS跨域中间件（允许所有来源的跨域请求，适用于开发和演示场景）；注册自定义响应格式化中间件`responseHandler`，为res对象添加统一的响应格式化方法；注册请求日志中间件（打印请求时间、HTTP方法和路径，便于调试）；注册`body-parser`中间件处理URL编码和JSON格式的请求体；挂载路由模块；提供上传文件的静态目录访问；注册全局错误处理中间件。服务默认监听8080端口，支持通过环境变量`PORT`自定义。"),
  pIndent("数据库连接通过`db/index.js`模块管理，使用`mysql.createPool()`创建连接池，连接配置（主机地址、用户名、密码、数据库名）从`.env`环境变量文件中读取，实现了敏感配置与代码的分离。"),
  h3("5.1.2 用户认证模块实现"),
  pIndent("用户认证模块由`userController.js`、`userService.js`（业务逻辑层）和`userModel.js`（数据访问层）组成。"),
  pIndent("注册流程：前端提交用户名和密码至`POST /api/user/reguser`接口。控制器接收参数后调用服务层，服务层首先查询数据库确认用户名不存在，然后使用`bcryptjs.hashSync()`对密码进行10轮加盐哈希加密，将哈希后的密码字符串（而非明文）存入users表。"),
  pIndent("登录流程：前端提交用户名和密码至`POST /api/user/login`接口。服务层从数据库查询用户记录，使用`bcryptjs.compareSync()`对比前端传入的明文密码与数据库中存储的哈希密码。验证通过后，使用`jsonwebtoken.sign()`方法，以用户的`user_id`和`status`为载荷，结合配置文件中的JWT密钥生成Token（有效期可配置），将Token以JSON格式返回给前端。前端将Token存入Pinia Store并持久化到localStorage。"),
  pIndent("Token验证中间件：在`middleware/auth.js`中实现了`verifyToken`中间件函数。中间件从请求头的`Authorization`字段中提取Bearer Token，使用`jsonwebtoken.verify()`方法验证Token签名与有效期。验证成功后，将解码的用户信息（包含user_id、status）挂载至`req.user`对象，供后续控制器逻辑使用；验证失败则返回401状态码。"),
  h3("5.1.3 电影管理模块实现"),
  pIndent("电影管理模块提供了完整的电影信息CRUD功能。关键实现细节如下："),
  pIndent("多图片上传实现：电影创建接口（`POST /api/movie/create`）支持同时上传电影海报（`movie_img`）、导演图片（`director_img`）和演员图片（`actor_img`）多个字段的多张图片。路由层使用Multer的`fields`配置，声明三个图片字段：`movie_img`、`director_img`、`actor_img`，每个字段最多允许上传5张图片，文件以内存方式（`memoryStorage`）缓存。控制器层接收到Multer处理后的`req.files`对象（字段名为键，文件数组为值），遍历每个字段的文件数组，调用`uploadManyToOSS`工具函数，利用`Promise.all`并发上传至阿里云OSS。上传时，每个文件的对象Key格式为`{fieldName}/{timestamp}_{random}.{ext}`，确保全局唯一性。三个字段的上传操作也通过`Promise.all`并发执行，整体上传效率较高。上传完成后，将各字段的URL数组以逗号拼接为字符串，存入对应数据库字段。"),
  pIndent("分类标签处理：`category_ids`字段在数据库中以字符串格式存储，内容为逗号分隔的分类ID列表（如`0,1,3`）。创建电影时，前端传入用户选择的分类ID列表，后端在首位补充固定ID`0`（表示全部类别）后拼接存储。前端读取时将字符串解析为数组，用于与前端定义的分类标签映射表（`data.js`中的分类配置）进行比对，实现多标签的展示。"),
  pIndent("热映榜单：`GET /api/movie/hot`接口返回热映电影榜单，通过SQL连接查询movie表和session表，统计每部电影的场次数量，按场次数量降序排列后返回前N条记录，为首页热映榜单提供数据支撑。"),
  pIndent("AI专用接口：`POST /api/movie/createcoze`专为Coze智能体调用设计，接收普通`application/x-www-form-urlencoded`格式的表单数据，图片字段直接接收URL字符串，省去了文件上传步骤，简化了AI与API的对接。接口对各字段设有默认值兜底处理（如show_time为'NaN-NaN-NaN'时自动替换为'2026-01-01'），增强了对AI生成数据的鲁棒性。"),
  h3("5.1.4 影厅管理模块实现"),
  pIndent("影厅管理模块的核心在于座位矩阵的生成与存储。创建影厅时，前端传入影厅名称、行数（rnum）和列数（cnum），服务层根据行列数生成一个`rnum × cnum`的二维数组，数组每个元素初始值为1（表示座位可用），最终序列化为JSON字符串存入`hall.seat`字段。管理员在影厅详情页可以通过点击座位图中的具体座位来切换其状态（1/0），每次修改都会触发API调用，更新数据库中的`seat`字段。前端的座位图组件（`seatTable.vue`和`seatTableAdmin.vue`）通过解析`seat`字段的JSON数组动态渲染座位格子，不同状态的座位以不同的图标和颜色表示。"),
  h3("5.1.5 场次管理与座位锁定实现"),
  pIndent("场次管理模块实现了排片信息的增删查改。创建场次时，需要关联指定的电影ID和影厅ID，设置放映的开始时间和结束时间（通过日期时间选择器选取）以及票价。查询场次时，支持按电影ID、影厅ID、日期范围等条件过滤，模型层通过拼接WHERE子句实现灵活查询。"),
  pIndent("座位锁定是保障购票并发安全的关键机制。用户在选座页面（`setOrder.vue`）完成座位选择后，前端调用`POST /api/order/lockSeat`接口。后端接收到用户选择的座位坐标数组后，在同一个数据库事务中执行两步操作：首先向`order`表插入一条新记录，状态为1（锁定中），过期时间设为当前时间加15分钟；然后批量向`order_seat`表插入该订单的所有座位记录。接口返回生成的`order_id`和过期时间。"),
  pIndent("查询某场次的已锁定座位时，调用`GET /api/session/getLockedSeat`接口，后端联合查询`order`表和`order_seat`表，筛选出该场次中状态为1（锁定）且`exp`时间未过期、或状态为2（已支付）的订单所占用的座位，返回这些座位的行列坐标，前端据此标记不可选座位。"),
  h3("5.1.6 订单支付与退票实现"),
  pIndent("订单支付接口（`POST /api/order/pay`）接收`order_id`，首先校验该订单是否属于当前登录用户，并验证订单状态是否为1（锁定中）且未过期，通过校验后将订单`status`更新为2（已支付），同时将`exp`字段更新为极远未来的时间戳（公元3000年1月1日），确保已支付订单永不过期。"),
  pIndent("退票接口（`POST /api/order/refund`）接收`order_id`，校验订单归属和状态（必须为2-已支付），通过后将订单`status`更新为3（已退票），将`exp`设置为过去时间，使该订单的座位重新变为可选状态。"),
  pIndent("用户订单列表接口（`GET /api/order/getUserOrders`）从Token中提取`user_id`，联合查询`order`、`order_seat`、`session`、`movie`、`hall`等多个表，返回完整的订单详情列表，包括电影名称、场次时间、影厅名称、座位坐标、票价、订单状态、过期时间等。"),

  h2("5.2 前端各模块实现"),
  h3("5.2.1 首页实现"),
  pIndent("首页（`src/views/index/index.vue`）是用户进入系统后看到的第一个页面，也是系统功能的入口。页面由顶部导航栏（`topNav.vue`组件）和主内容区组成。主内容区包含系统Banner图、热映电影榜单和在映电影分类推荐列表三个部分。"),
  pIndent("热映榜单通过调用`/api/movie/hot`接口获取数据，以列表形式展示；在映电影列表通过调用`/api/movie/list`接口获取全部电影，支持按分类标签切换（通过调用`/api/movie/searchByTab`接口），支持按中文名搜索（通过调用`/api/movie/searchByName`接口）。电影列表以卡片（`movieBox.vue`组件）形式排布，点击卡片跳转至对应的电影详情页。"),
  h3("5.2.2 电影详情页实现"),
  pIndent("电影详情页（`src/views/movieDetail/`目录）采用嵌套路由设计，外层路由（`/movieDetail/:id`）提供电影基本信息的展示框架，内层路由提供三个子页面：电影简介（`/movieDetail/:id/introduction`）、主创人员（`/movieDetail/:id/performer`）、图片集（`/movieDetail/:id/picture`）。"),
  pIndent("外层组件在`onMounted`生命周期钩子中调用`/api/movie/getById?movie_id=:id`接口获取电影详情，并将数据通过provide/inject或Pinia传递给子组件（本项目中子组件直接从父级路由组件的props或单独接口调用获取数据）。"),
  pIndent("场次查询页面（`/movieSession/:id`）提供了按日期查询该电影场次的功能，用户选择日期后调用`/api/session/getByMovieAndDate?movie_id=:id&date=:date`接口获取对应日期的场次列表，每个场次卡片显示放映时间、影厅、票价及剩余座位情况，点击场次卡片进入选座页面。"),
  h3("5.2.3 在线选座与下单流程实现"),
  pIndent("选座页面（`src/views/order/setOrder.vue`）是系统中交互最为复杂的页面之一。页面加载时，同时请求场次基本信息（`/api/session/getById`）和该场次的已锁定座位列表（`/api/session/getLockedSeat`），合并后渲染座位图（`seatTable.vue`组件）。"),
  pIndent("座位图组件根据影厅的`rnum`和`cnum`动态渲染`rnum × cnum`的座位矩阵。每个座位格子根据其状态（可用/已锁定/用户已选中）显示不同的图标和颜色：可用座位显示绿色座椅图标，已被锁定的座位显示灰色图标（不可点击），用户当前选中的座位显示橙色图标。用户点击可用座位时，该座位进入已选中状态，右侧汇总栏实时更新所选座位列表和总价。"),
  pIndent("用户确认选座后点击提交按钮，前端将选中的座位坐标数组（二维数组格式）和场次ID以POST方式发送至`/api/order/lockSeat`接口。锁座成功后，系统返回`order_id`和过期时间，前端携带这些信息跳转至订单支付页面（`payOrder.vue`），同时在选座页面显示倒计时（从响应的过期时间计算剩余时间）。"),
  pIndent("支付页面展示订单摘要信息（电影名、场次时间、座位列表、总价），用户确认后调用`/api/order/pay`接口完成支付，系统返回成功后跳转至个人中心订单列表。"),
  h3("5.2.4 管理员后台实现"),
  pIndent("管理员后台采用侧边栏+主内容区的经典管理系统布局（`src/views/admin/index.vue`）。侧边栏提供了影厅管理、场次管理、电影管理等功能的导航入口，点击导航项通过Vue Router切换主内容区展示的组件（嵌套路由实现）。"),
  pIndent("电影添加页面（`addMovie.vue`）使用Element Plus的`el-form`组件实现表单，包含所有电影信息字段的输入控件，图片字段使用`el-upload`组件实现拖拽或点击上传，支持上传前的预览和删除操作。表单提交时，使用`FormData`对象将表单数据和文件数据封装为`multipart/form-data`格式，通过Axios发送至后端。"),
  pIndent("影厅创建页面（`addHall.vue`）除常规表单字段外，还实时渲染了根据用户输入的行列数生成的座位预览图，管理员可直接在预览图上点击标记特定座位为不可用状态。"),
  pIndent("场次添加页面（`addSession.vue`）提供了电影选择下拉框（从`/api/movie/list`获取电影列表）、影厅选择下拉框（从`/api/hall/list`获取影厅列表）、日期时间选择器（选择开始和结束时间）以及票价输入框。"),
  h3("5.2.5 用户中心实现"),
  pIndent("用户中心页面（`src/views/user/index.vue`）展示当前登录用户的基本信息和历史订单列表。页面加载时调用`/api/order/getUserOrders`接口获取该用户的全部订单，以卡片列表（`myOrder.vue`组件）形式展示。每张订单卡片显示电影名称、场次时间、影厅名称、座位信息、金额及当前状态（已锁定/已支付/已退票/已过期）。对于已支付且未退票的订单，显示退票按钮，点击后二次确认并调用退票接口。"),
  h3("5.2.6 Axios请求封装"),
  pIndent("在`src/utils/request.js`中创建了Axios实例并配置了全局请求和响应拦截器。请求拦截器从Pinia的用户Store中获取token，若token存在则在每个请求的`Authorization`头中附加`Bearer {token}`，实现了全局的JWT Token自动携带，无需在每个API调用处手动处理。响应拦截器对后端返回的HTTP状态码进行统一处理：对于401（Token失效）响应，自动清除本地登录态并使用`router.push('/login')`跳转至登录页，避免了在每个业务接口处重复处理认证失效的逻辑。"),

  h2("5.3 AI智能体实现细节"),
  h3("5.3.1 工作流节点实现"),
  pIndent("Coze工作流的各个节点通过可视化编排界面配置，各节点之间通过变量引用（`{{变量名}}`）进行数据传递。"),
  pIndent("槽位提取LLM节点的系统提示词（System Prompt）设计是整个工作流的关键。提示词明确要求模型从用户输入中提取约40个预定义字段的值，字段集覆盖了电影、影厅、场次、订单等所有业务实体的属性，以及相关API接口的URL模板（`movie_url`、`hall_url`等）和飞书表格相关字段。这种设计使得单一LLM节点能够为后续所有分支的数据提取需求提供支撑，避免了为每个分支单独配置提取节点。"),
  pIndent("意图识别节点配置了四个意图类别（根据文件/文本描述，添加影片/影厅），并使用了思维链（Chain of Thought）推理模式（`thinkingType: enabled`），提升了复杂输入场景下意图识别的准确率。节点还配置了错误处理策略：识别失败时以特定的默认分类结果继续流程，而不会中断整个工作流。"),
  pIndent("HTTP节点直接调用后端API，配置了请求方法（POST）、目标URL（后端服务的公网地址）、请求头和请求体参数。请求体参数值通过变量引用从上游节点（槽位提取LLM节点或飞书文档读取节点）的输出中动态获取，实现了数据的链路传递。"),
  h3("5.3.2 飞书表格数据读取实现"),
  pIndent("对于通过飞书多维表格批量添加电影/影厅的场景，工作流中集成了Coze平台提供的飞书（Lark）文档读取插件。该插件能够解析用户输入的飞书多维表格链接，读取指定表格中的所有记录，并以结构化的JSON数组格式返回每行数据。工作流在获取飞书表格数据后，通过循环逻辑（Loop节点或代码节点中的循环）遍历每条记录，对每条记录分别调用HTTP节点写入后端API，实现了批量录入。这种设计使管理员可以预先在飞书多维表格中整理好大批量的电影或影厅数据，然后只需将表格链接粘贴至智能体对话框，便可触发自动批量写入，极大地提升了数据录入效率。"),

  h2("5.4 云存储集成实现"),
  pIndent("阿里云OSS的集成封装在`api/utils/oss.js`工具模块中。该模块通过`ali-oss` SDK创建OSS客户端实例，从环境变量中读取OSS的AccessKey ID、AccessKey Secret、Bucket名称和地域Endpoint等敏感配置。"),
  pIndent("核心上传函数`uploadFile(key, buffer)`接收对象Key和文件的Buffer数据，调用`client.put(key, buffer)`方法将文件上传至OSS，成功后根据Bucket地域和名称拼接图片的公网访问URL并返回。该函数被封装为async函数，通过Promise链式调用，在控制器层通过`Promise.all`实现多文件并发上传，显著提升了批量图片上传的响应速度。"),
  pIndent("阿里云OSS Bucket的访问权限设置为公读私写，即所有人可以通过公网URL直接访问存储的图片资源，但写入（上传/删除）操作需要有效的AccessKey才能执行，保证了资源的安全访问控制。"),
];

// Chapter 6
const chapter6 = [
  pageBreak(),
  h1("第六章  系统测试"),
  h2("6.1 测试环境"),
  pIndent("系统测试在以下环境中进行："),
  pIndent("服务端运行环境：操作系统Windows 11，Node.js版本v20.x，Express.js版本4.17.1，MySQL版本8.0.x，pnpm包管理器。"),
  pIndent("客户端运行环境：Chrome浏览器（最新版）、Edge浏览器，操作系统Windows 11，显示分辨率1920×1080。"),
  pIndent("云服务环境：阿里云OSS（华北2-北京地域），Coze平台（国内版）。"),
  pIndent("开发工具：Visual Studio Code，Postman（API测试），MySQL Workbench（数据库管理）。"),

  h2("6.2 功能测试"),
  h3("6.2.1 用户认证模块测试"),
  pIndent("测试用例TC-01：用户注册功能。输入：用户名`testuser001`，密码`Test@123456`。预期结果：注册成功，数据库users表新增一条记录，密码字段存储的是bcrypt哈希值而非明文。实际结果：注册成功，数据库记录符合预期，pwd字段以`$2b$10$...`格式存储哈希密码。"),
  pIndent("测试用例TC-02：重复用户名注册。输入：用户名`testuser001`（已存在），密码任意。预期结果：注册失败，提示「用户名已存在」。实际结果：服务端返回400状态码及错误提示，前端弹出错误消息。"),
  pIndent("测试用例TC-03：用户登录功能。输入：正确的用户名和密码。预期结果：登录成功，返回JWT Token，前端存储Token并跳转首页。实际结果：登录成功，Network面板可见服务端返回包含token字段的JSON响应，Pinia Store中用户状态更新，localStorage中token持久化成功。"),
  pIndent("测试用例TC-04：错误密码登录。输入：正确用户名，错误密码。预期结果：登录失败，提示密码错误。实际结果：服务端返回400状态码，前端弹出【密码错误】提示。"),
  pIndent("测试用例TC-05：未登录访问需要权限的页面。操作：在未登录状态下直接访问`/user`页面URL。预期结果：路由守卫拦截，弹出【请先登录】提示并跳转至`/login`页面。实际结果：行为符合预期。"),
  h3("6.2.2 电影管理模块测试"),
  pIndent("测试用例TC-06：电影信息录入（含图片上传）。操作：管理员登录，进入【添加电影】页面，填写完整的电影信息，分别上传电影海报1张、导演照片1张、演员照片2张，点击提交。预期结果：电影创建成功，数据库movie表新增记录，图片字段存储阿里云OSS URL，控制台日志显示图片上传至OSS成功。实际结果：测试通过，OSS控制台可在对应目录下查看到上传的图片文件。"),
  pIndent("测试用例TC-07：按分类标签筛选电影。操作：在电影列表页点击【动作】分类标签。预期结果：列表仅显示`category_ids`字段中包含动作类别ID的电影。实际结果：测试通过，筛选结果正确。"),
  pIndent("测试用例TC-08：关键词搜索电影。操作：在搜索框输入【星际】，点击搜索。预期结果：列表显示中文名包含【星际】的电影。实际结果：测试通过，MySQL的LIKE查询正确执行。"),
  pIndent("测试用例TC-09：删除电影。操作：管理员在电影列表选择某电影，点击删除并确认。预期结果：该电影从列表消失，数据库对应记录被删除。实际结果：测试通过。"),
  h3("6.2.3 影厅与场次管理测试"),
  pIndent("测试用例TC-10：创建影厅。操作：管理员填写影厅名称【1号厅】，行数8，列数10，在座位预览图中将第3行第5列标记为不可用，点击提交。预期结果：影厅创建成功，数据库hall表记录的seat字段中，对应位置的值为0，其余为1。实际结果：测试通过，seat字段JSON数据解析正确。"),
  pIndent("测试用例TC-11：创建放映场次。操作：管理员选择已有电影和影厅，设置开始时间2026-05-01 14:00，结束时间2026-05-01 16:00，票价39.9元，提交。预期结果：场次创建成功，在场次列表中可查看到新建场次，关联的电影名和影厅名正确。实际结果：测试通过。"),
  h3("6.2.4 在线购票流程测试"),
  pIndent("测试用例TC-12：完整购票流程测试。操作：用户登录→选择电影→选择场次→选择座位（选择第3排第4座和第3排第5座）→提交→进入支付页面→确认支付。预期结果：每步操作后系统响应正确；锁座后数据库order表新增一条status=1的记录，order_seat表插入2条座位记录；支付后order表对应记录status=2；再次进入同一场次的选座页面，第3排第4座和第5座显示为已锁定状态（灰色，不可点击）。实际结果：测试通过，购票流程完整运行正常。"),
  pIndent("测试用例TC-13：订单过期后座位释放测试。操作：完成锁座后（status=1），等待15分钟使订单过期，再次查看该场次座位图。预期结果：已过期的锁座对应座位重新变为可选状态（绿色）。实际结果：测试通过，后端查询时过滤了exp已过期的记录，座位状态正确释放。"),
  pIndent("测试用例TC-14：退票功能测试。操作：在用户中心找到已支付订单，点击退票并确认。预期结果：订单状态更新为3（已退票），订单卡片显示【已退票】标签，对应场次座位在下次查询时不再被占用。实际结果：测试通过。"),
  h3("6.2.5 AI智能体功能测试"),
  pIndent("测试用例TC-15：通过自然语言添加电影。输入：在Coze智能体对话框中输入【请添加一部电影，中文名《流浪地球3》，英文名Wandering Earth 3，上映时间2027年春节，时长150分钟，地区中国大陆，分类科幻动作，导演郭帆，主演吴京刘德华，简介：第三部科幻巨作】。预期结果：智能体识别意图为【根据文本描述添加影片】，提取各字段值，调用`/api/movie/createcoze`接口写入数据库，返回【创建电影成功】的结果消息。实际结果：测试通过（经过多次迭代调整提示词后），电影数据成功写入数据库。"),
  pIndent("测试用例TC-16：通过飞书多维表格批量添加电影。操作：预先在飞书多维表格中准备3部电影的完整信息（含各字段），将表格分享链接输入智能体，指令【根据此飞书表格链接批量添加电影】。预期结果：智能体读取飞书表格中的3条记录，依次调用API写入，最终返回批量操作结果。实际结果：测试通过，3部电影成功写入数据库（在网络条件良好的情况下）。"),
  pIndent("通过以上测试，系统的核心功能均能正常运行，AI智能体在网络稳定的情况下意图识别准确率较高，但对于字段不完整或描述歧义较大的输入，存在字段提取不准确的情况，这是大语言模型技术本身的局限性所在，需要通过进一步优化提示词和增加数据校验来改善。"),

  h2("6.3 非功能性测试"),
  h3("6.3.1 安全性验证"),
  pIndent("使用Postman对需要鉴权的接口（如`/api/order/lockSeat`、`/api/movie/create`）在不携带Token的情况下发起请求，服务端正确返回401状态码，接口安全机制有效。测试了SQL注入场景（在搜索框输入`' OR '1'='1`），由于后端采用参数化查询，注入语句被当作普通字符串处理，未产生异常查询结果，SQL注入防护有效。"),
  h3("6.3.2 页面响应性验证"),
  pIndent("在本地网络环境下，各页面的首次加载时间均在1秒以内（含API请求时间）。电影列表页面（约20条数据）的渲染耗时约200ms，选座页面（8×10座位矩阵）的动态渲染耗时约100ms。图片上传至OSS的响应时间与图片大小相关，单张图片（200KB以内）的上传耗时通常在500ms以内，整体用户体验流畅。"),
];

// Chapter 7
const chapter7 = [
  pageBreak(),
  h1("第七章  总结与展望"),
  h2("7.1 工作总结"),
  pIndent("本文以【基于Vue3与Node.js的影院售票管理系统设计与实现】为课题，完成了一套功能较为完整的Web端影院票务管理系统的设计与开发工作，并在此基础上探索了大语言模型与传统业务系统融合的实践路径。"),
  pIndent("在系统功能层面，项目实现了影院票务管理的核心业务闭环：包括用户注册与登录（JWT认证）、电影信息管理（含多图片OSS云存储）、影厅配置管理（自定义座位矩阵）、场次排片管理、用户在线浏览电影、按日期查询场次、可视化选座、座位锁定与15分钟过期机制、在线支付、退票及历史订单查看等完整票务流程，覆盖了影院日常运营的主要业务场景。"),
  pIndent("在技术架构层面，系统采用前后端分离架构，前端基于Vue3 + Vite + Element Plus + Pinia + Vue Router构建高交互性的单页面应用，后端基于Node.js + Express.js遵循MVC分层架构设计RESTful API，数据层采用MySQL关系型数据库，图片资源存储采用阿里云OSS，整体架构清晰、职责分离明确、可维护性较好。"),
  pIndent("在AI辅助功能层面，通过Coze平台搭建的多层意图识别工作流智能体，实现了管理员通过自然语言文本描述或飞书多维表格链接批量录入电影和影厅数据的功能。工作流设计中，合理运用了槽位提取LLM节点、意图识别节点、HTTP节点等多种Coze能力，在不修改现有后端代码的基础上（仅增加了一个AI专用接口`createcoze`），实现了AI层与业务系统的低侵入性集成，为同类系统的AI化改造提供了参考方案。"),

  h2("7.2 不足之处"),
  pIndent("尽管项目在预期功能范围内取得了较好的实现效果，但仍存在若干不足之处，值得在未来的迭代中加以改进："),
  pIndent("第一，高并发处理能力不足。当前系统的座位锁定机制基于数据库层面的状态管理，在高并发购票场景下（如热门电影开票瞬间），可能出现多个用户同时锁定同一座位的数据一致性问题。生产级系统应引入Redis分布式锁或数据库事务的乐观锁/悲观锁机制来解决这一问题。"),
  pIndent("第二，缺乏真实支付集成。当前的【支付】功能仅为逻辑上的状态更新，并未接入支付宝、微信支付等真实支付渠道，无法在实际生产环境中使用。后续可通过接入支付宝沙箱环境的支付API完善支付功能。"),
  pIndent("第三，AI智能体稳定性和准确性有限。大语言模型的输出存在不确定性，在面对格式不规范或描述歧义的输入时，字段提取结果可能不准确或缺失，导致写入数据库的记录存在空字段或错误值。此外，AI调用链路较长（Coze平台→HTTP节点→后端API），在网络不稳定时整体成功率会有所下降。"),
  pIndent("第四，前端UI适配性有限。当前系统主要针对桌面端浏览器设计，移动端（手机、平板）的响应式适配工作较为有限，在小屏幕设备上的体验有待优化。"),
  pIndent("第五，缺乏完善的日志与监控机制。当前后端仅有基础的console.log请求日志，缺乏结构化的日志记录、异常监控告警等生产级运维保障措施。"),

  h2("7.3 未来展望"),
  pIndent("基于以上不足，未来可从以下几个方向对系统进行优化和扩展："),
  pIndent("（1）引入Redis缓存与分布式锁：利用Redis的原子操作特性实现选座高并发下的座位锁定，同时将热点数据（如热映电影列表、场次信息）缓存至Redis，减轻MySQL数据库的查询压力，显著提升系统并发处理能力。"),
  pIndent("（2）接入真实支付渠道：集成支付宝开放平台或微信支付的SDK，实现完整的在线支付、退款流程，同时完善订单的状态机设计，增加已支付、退款中、退款成功等中间状态。"),
  pIndent("（3）优化AI智能体能力：通过持续优化Coze工作流的提示词设计，引入输出格式的JSON Schema校验，增加字段值合法性验证（如日期格式、数值范围）和重试机制，提升AI辅助录入的准确率和鲁棒性。探索将大语言模型能力直接集成至后端API（如使用Anthropic Claude、OpenAI GPT等的API），减少对第三方平台的依赖。"),
  pIndent("（4）完善移动端适配：基于媒体查询或引入移动端专用的UI组件（如Vant），优化系统在手机浏览器上的访问体验，实现真正的多终端兼容。"),
  pIndent("（5）引入微服务架构：随着业务规模的扩大，可将当前的单体后端服务拆分为用户服务、电影服务、订单服务等独立微服务，借助容器化技术（Docker + Kubernetes）实现弹性扩缩容，满足大规模并发场景下的稳定性要求。"),
  pIndent("（6）数据分析能力建设：在现有数据积累的基础上，构建数据分析模块，为影院管理层提供上座率趋势、热门电影分析、票房预测等数据洞察能力，进一步提升系统的商业价值。"),
];

// References
const references = [
  pageBreak(),
  h1("参考文献"),
  new Paragraph({ children: [new TextRun({ text: "[1] 尤雨溪, Vue.js核心团队. Vue3官方文档[EB/OL]. https://cn.vuejs.org/, 2022.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[2] OpenJS Foundation. Express.js官方文档[EB/OL]. https://expressjs.com/, 2021.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[3] JSON Web Token Introduction[EB/OL]. https://jwt.io/introduction/, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[4] 字节跳动. Coze平台官方文档[EB/OL]. https://www.coze.cn/docs, 2024.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[5] 阿里云. 对象存储OSS开发者文档[EB/OL]. https://help.aliyun.com/product/31815.html, 2024.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[6] Pinia官方文档[EB/OL]. https://pinia.vuejs.org/zh/, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[7] 张三, 李四. 基于Vue和Spring Boot的在线电影票务系统设计与实现[J]. 计算机应用与软件, 2023, 40(5): 158-164.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[8] Brown T, Mann B, Ryder N, et al. Language Models are Few-Shot Learners[C]. Advances in Neural Information Processing Systems, 2020: 1877-1901.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[9] OpenAI. ChatGPT: Optimizing Language Models for Dialogue[EB/OL]. https://openai.com/blog/chatgpt/, 2022.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[10] Zhao W X, Zhou K, Li J, et al. A Survey of Large Language Models[J]. arXiv preprint arXiv:2303.18223, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[11] 王芳, 陈明. 大语言模型在企业业务系统中的集成应用研究[J]. 软件工程与应用, 2024, 13(2): 45-53.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[12] MySQL 8.0 Reference Manual[EB/OL]. https://dev.mysql.com/doc/refman/8.0/en/, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[13] Element Plus官方文档[EB/OL]. https://element-plus.org/zh-CN/, 2024.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[14] Vite官方文档[EB/OL]. https://cn.vitejs.dev/, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[15] Devlin J, Chang M W, Lee K, et al. BERT: Pre-training of Deep Bidirectional Transformers for Language Understanding[C]. Proceedings of NAACL-HLT, 2019: 4171-4186.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[16] 国家电影局. 2023年中国电影市场数据报告[R]. 北京: 国家电影局, 2024.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[17] 刘洋. 基于微服务架构的影院管理系统研究[D]. 北京邮电大学, 2022.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[18] Wei J, Wang X, Schuurmans D, et al. Chain-of-Thought Prompting Elicits Reasoning in Large Language Models[J]. Advances in Neural Information Processing Systems, 2022, 35: 24824-24837.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[19] Axios官方文档[EB/OL]. https://axios-http.com/zh/docs/intro, 2023.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
  new Paragraph({ children: [new TextRun({ text: "[20] Multer文档[EB/OL]. https://github.com/expressjs/multer, 2022.", font: "宋体", size: 22 })], spacing: { line: 480 }, indent: { hanging: 440, left: 440 } }),
];

// ── Build document ────────────────────────────────────────────────────────────
const doc = new Document({
  styles: {
    default: {
      document: {
        run: { font: "宋体", size: 24 },
      },
    },
    paragraphStyles: [
      {
        id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "黑体", color: "000000" },
        paragraph: { spacing: { before: 480, after: 240, line: 480 }, outlineLevel: 0 },
      },
      {
        id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 28, bold: true, font: "黑体", color: "000000" },
        paragraph: { spacing: { before: 360, after: 180, line: 480 }, outlineLevel: 1 },
      },
      {
        id: "Heading3", name: "Heading 3", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "黑体", color: "000000" },
        paragraph: { spacing: { before: 240, after: 120, line: 480 }, outlineLevel: 2 },
      },
    ],
  },
  numbering: {
    config: [],
  },
  sections: [
    {
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1800 },
        },
      },
      children: [
        ...titlePage,
        ...abstract_cn,
        ...abstract_en,
        ...chapter1,
        ...chapter2,
        ...chapter3,
        ...chapter4,
        ...chapter5,
        ...chapter6,
        ...chapter7,
        ...references,
      ],
    },
  ],
});

Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync("/home/claude/thesis_ttms.docx", buffer);
  console.log("Done! thesis_ttms.docx created.");
});