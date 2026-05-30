# 今日小冒险

React + Vite 小程序原型。每天开启一个生活任务盲盒，完成现实中的小任务，获得 EXP、属性成长和冒险日志记录。

## 本地运行

```bash
npm install
npm run dev
```

默认开发地址：

```text
http://localhost:5173/
```

## 构建

```bash
npm run build
```

Vite 默认会输出到 `dist/` 目录。

## Vercel 部署

在 Vercel 导入仓库后使用默认 Vite 配置即可：

- Framework Preset: `Vite`
- Build Command: `npm run build`
- Output Directory: `dist`
- Install Command: `npm install`

当前项目不需要后端服务和登录，数据保存在浏览器 `localStorage` 中。
