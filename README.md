# 服装创业助手

一个面向服装店创业者的手机端小工具：算清楚每个月、每天至少要做多少营业额才能保本，并把多套经营假设保存在本机。

**在线使用：** https://ollieyan1994-cyber.github.io/fzcy-assistant/

## 功能

- 输入房租、物业费、水电费、人工、收银系统、其他固定支出
- 输入装修投入、设备投入和租期，自动计算每月摊销
- 输入实际综合毛利率（默认 42.5%，提供 40% / 45% 快选），实时计算：
  - 每月保本销售额
  - 每日保本销售额
  - 按客单价和购买转化率推算的每日成交单数、所需有效客流
  - 毛利率 40% / 45% 两种假设下的保本参考
- 多套方案保存、查看、载入修改、删除
- 可安装到手机桌面（PWA），首次打开后离线可用
- 不注册、不联网上传，数据只保存在本机浏览器

## 计算口径

| 项目 | 公式 |
| --- | --- |
| 装修设备月摊销 | (装修 + 设备) ÷ 租期月数 |
| 月固定总成本 | 房租 + 物业 + 水电 + 人工 + 收银系统 + 其他 + 月摊销 |
| 月保本销售额 | 月固定总成本 ÷ 实际综合毛利率 |
| 日保本销售额 | 月保本销售额 ÷ 月营业天数 |
| 日均成交单数 | 日保本销售额 ÷ 平均客单价 |
| 所需日有效客流 | 日均成交单数 ÷ 购买转化率 |

金额四舍五入到元；单量和客流向上取整，表示“至少需要”。实际综合毛利率应扣除打折促销和库存损耗。

## 本地开发

要求 Node.js 22+。

```bash
cd app
npm install
npm run dev
```

本地开发地址：<http://localhost:5173/fzcy-assistant/>

常用命令：

```bash
npm test        # 计算逻辑单元测试
npm run lint    # 代码检查
npm run build   # 生产构建，输出到 app/dist
npm run preview # 预览生产构建
npm run icons   # 重新生成 PWA 图标
```

## 部署

仓库带有 `.github/workflows/deploy.yml`，推送到 `main` 后会自动测试、构建并部署到 GitHub Pages。

Vite 的 `base` 固定为 `/fzcy-assistant/`，因此 GitHub 仓库名需要是 `fzcy-assistant`；如果改名，请同步修改 `app/vite.config.ts` 和 manifest 里的路径。

部署前需要在仓库 **Settings → Pages → Build and deployment** 将 Source 设为 **GitHub Actions**。

## 手机安装

1. 安卓 Chrome 打开上面的在线地址
2. 点右上角菜单 → **安装应用** / **添加到主屏幕**
3. 之后从桌面图标打开，离线也能使用

## 数据说明

- 方案和上次输入保存在浏览器 `localStorage`
- 卸载应用、清除浏览器网站数据会删除记录
- 当前版本不提供导出备份；重要方案请自行截图留存

## 目录

```text
app/                    Vite + React + TypeScript 前端
  src/lib/calc.ts       保本计算核心（含单元测试）
  src/lib/storage.ts    本地存储
  src/pages/            测算、方案列表、方案详情
  scripts/              图标生成脚本
.github/workflows/      GitHub Pages 自动部署
```
