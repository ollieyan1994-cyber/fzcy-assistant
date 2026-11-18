# 部署到 Cloudflare Pages

目标地址：<https://fzcy.hiyaa.top>

网站是纯静态 PWA，不需要服务器和数据库。Cloudflare Pages 免费、允许商业使用，自定义子域名只需在西部数码加一条 CNAME，不影响 `hiyaa.top` 上现有的「hiyaa伴伴屋」。

## 一、创建 Pages 项目

1. 登录 <https://dash.cloudflare.com>，左侧选 **Workers & Pages** → **Create** → **Pages** → **Connect to Git**。
2. 授权 GitHub，选择仓库 `ollieyan1994-cyber/fzcy-assistant`。
3. 项目名填 `fzcy-assistant`，生产分支选 `main`。
4. 构建设置：

   | 项目 | 值 |
   | --- | --- |
   | Framework preset | Vite（没有就选 None） |
   | Root directory | `app` |
   | Build command | `npm run build` |
   | Build output directory | `dist` |

5. 环境变量（Production 和 Preview 都加）：

   | 变量名 | 值 |
   | --- | --- |
   | `VITE_BASE` | `/` |
   | `NODE_VERSION` | `22` |

   `VITE_BASE=/` 是关键：项目默认按 GitHub Pages 的 `/fzcy-assistant/` 子路径构建，Cloudflare Pages 部署在域名根路径，必须覆盖成 `/`。

6. 点 **Save and Deploy**，等第一次构建完成。默认地址是 `https://fzcy-assistant.pages.dev`，先打开确认页面正常。

## 二、绑定自定义域名

1. 进入 Pages 项目 → **Custom domains** → **Set up a domain**。
2. 填 `fzcy.hiyaa.top`，继续。
3. 因为 `hiyaa.top` 的 DNS 不在 Cloudflare，页面会提示添加一条 CNAME，目标值通常是：

   ```
   fzcy-assistant.pages.dev
   ```

   **先在 Pages 里完成这一步，再去加 DNS**；顺序反了会报 522。

## 三、在西部数码加解析

1. 登录西部数码 → 域名管理 → `hiyaa.top` → 解析。
2. 新增记录：

   | 字段 | 值 |
   | --- | --- |
   | 主机名 | `fzcy` |
   | 类型 | `CNAME` |
   | 线路 | 默认 |
   | 记录值 | `fzcy-assistant.pages.dev` |
   | TTL | 默认（600 / 3600） |

   主机名只填 `fzcy`，不要填整个域名；如果面板要求填全名，就填 `fzcy.hiyaa.top`。

3. 保存后等 5~10 分钟。Cloudflare Pages 的 Custom domains 页面会从 Pending 变成 Active，并自动签发 HTTPS 证书。

## 四、验证

```bash
dig +short CNAME fzcy.hiyaa.top
curl -I https://fzcy.hiyaa.top
```

- CNAME 应指向 `fzcy-assistant.pages.dev`
- HTTP 状态码应为 `200`
- 浏览器打开 `https://fzcy.hiyaa.top`，确认图标、样式、方案保存都正常
- 手机 Chrome / Safari 打开后“添加到主屏幕”，断网再打开，确认离线可用

## 五、以后更新

推送到 `main` 即自动构建部署，不需要手动上传。

```bash
git add .
git commit -m "你的改动"
git push
```

GitHub Pages 的旧地址仍然可用，不受影响：构建时没有设置 `VITE_BASE`，会自动回退到 `/fzcy-assistant/`。

## 常见问题

**Custom domains 一直 Pending**

- 检查 CNAME 是否生效：`dig +short CNAME fzcy.hiyaa.top`
- 检查 `fzcy` 下有没有冲突的 A / AAAA / URL 转发记录，有就删掉
- 西部数码的 TTL 较长时，最多等 24 小时

**522 / 521**

一般是先在 DNS 加了 CNAME、但没在 Pages 里关联域名。回到 Pages → Custom domains 重新添加一次。

**页面白屏、资源 404**

`VITE_BASE` 没生效。确认环境变量值是 `/`，然后在 Pages 的 Deployments 里点 **Retry deployment**，必要时清空 build cache 再构建。

**更新后还是旧版本**

PWA 的 Service Worker 缓存。等几分钟重新打开，或在浏览器里强制刷新；`_headers` 已把 `sw.js` 设为 no-cache，正常情况下会自动更新。

**国内不挂 VPN 打不开**

Cloudflare Pages 走海外节点，国内直连可能慢或不通。这个站在装成 PWA 后可以离线使用；需要稳定直连时再考虑 IPv6 直连方案。
