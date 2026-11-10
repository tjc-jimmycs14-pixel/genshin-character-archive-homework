# 原神角色與技能圖鑑 — 7.2 資料版

以《原神》角色介面為靈感製作的**非官方繁體中文靜態網站**。使用 HTML5、CSS3、原生 JavaScript（ES Modules）與 JSON；沒有 React、Vue、CDN、外部 JS、即時 API、資料庫或後端。

> **資料進度（2026-11-10）**：收錄 122 位角色的名稱、元素、武器與稀有度，涵蓋 2026-11-04 上線的 7.2 版。**14 位角色**已整理角色介紹、普通攻擊、元素戰技、元素爆發與固有天賦的摘要；**108 位角色**目前只有索引及基本資料，技能名稱／效果尚未逐一完成核對，網站會顯示「資料整理中」。因此本版已完成可擴充的完整網站架構與廣泛的角色索引，**尚未達到所有角色的完整技能資料**，請勿將待補狀態當作已完成內容。

## 功能

- 122 位角色的資料索引，每位角色對應 `data/characters/<id>.json`，共用一個詳細頁版型。
- 元素、武器、四／五星、資料整理狀態篩選；繁體中文名稱／英文 ID 搜尋；排序與每次顯示更多角色。
- 左／中／右角色詳情排版，包含基本資訊、普通攻擊、元素戰技、元素爆發與固有天賦切換。
- 角色快速選單與相鄰角色導覽；切換技能不會重新載入整張網頁。
- 390px、320px 等窄螢幕支援、鍵盤焦點、圖片備援、JSON 讀取錯誤及零結果提示。
- `#/character/furina` 形式的雜湊路由，不需伺服器端重新導向；CSS、JS、JSON、圖像均採用相對路徑，能放在 GitHub Pages 儲存庫子路徑下。

## 目錄

```text
genshin-character-archive/
├── AGENTS.md              # 開發規範（保留使用者的文件）
├── README.md              # 本說明
├── .nojekyll              # 讓 GitHub Pages 直接發布靜態網站
├── index.html             # HTML 入口與共用語意化架構
├── css/
│   └── style.css          # 視覺、元素 CSS 變數、RWD
├── js/
│   ├── main.js            # 搜尋、篩選、路由、分批顯示與互動
│   ├── character.js       # 卡片、角色資訊、技能共用渲染
│   └── data.js            # JSON 載入、驗證、名稱表
├── data/
│   ├── characters.json    # 全角色索引（122 位）
│   └── characters/        # 122 份獨立角色 JSON
└── assets/
    ├── characters/       # 8 張上一版原創通用剪影（非官方角色立繪）
    ├── skills/           # 預留放置授權技能圖示
    └── backgrounds/      # 預留放置授權背景
```

## 本機預覽

請以 HTTP 伺服器開啟，不能直接雙擊 `index.html` 使用 `file://`，否則瀏覽器通常會阻擋 `fetch` 讀取 JSON。

```bash
cd genshin-character-archive
python -m http.server 8000
```

然後開啟 `http://localhost:8000/`。詳細頁範例：`http://localhost:8000/#/character/furina`。

## GitHub Pages 部署（不必安裝任何套件）

1. 到 GitHub 建立新的儲存庫，建議名稱 `genshin-character-archive`。若使用 Git 指令，請建立空儲存庫，先不要勾選 GitHub 自動產生 README。
2. 解壓縮 ZIP，將**專案內所有檔案**上傳至儲存庫根目錄。注意：`index.html` 必須直接位於儲存庫根目錄，不能被多包一層資料夾。
3. 進入儲存庫 **Settings → Pages → Build and deployment**。
4. 在 **Source** 選 **Deploy from a branch**，分支選 **`main`**，資料夾選 **`/(root)`**，儲存。
5. 等 GitHub Pages 發布後，開啟 `https://YOUR_USERNAME.github.io/genshin-character-archive/`。若使用不同儲存庫名稱，把 URL 末段換成你的儲存庫名稱。
6. 驗證首頁清單能載入、搜尋和元素篩選有效；進入 `#/character/furina`、`#/character/hu-tao` 並切換天賦；確認相對路徑的 CSS/JSON/SVG 正常載入。

可選：在專案資料夾使用 Git CLI：

```bash
git init
git add .
git commit -m "Build Genshin character archive"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/genshin-character-archive.git
git push -u origin main
```

使用者若尚未設定 Git 身分，需先設定 `user.name`、`user.email`。網站本身沒有建置步驟。未部署上線前，不要把「可部署」誤寫為「已在 GitHub Pages 驗證」。

## 新增或補齊角色

請先閱讀 `AGENTS.md`。資料格式以 `data/characters/furina.json` 為參考：每一筆至少具備 `id`、`name`、`element`、`weapon`、`rarity`、`talents`，技能有 `normalAttack`、`elementalSkill`、`elementalBurst`、`passiveTalents`。不可為每一位角色複製 HTML。

角色索引 `data/characters.json` 使用相同的 `id`。`reviewStatus` 為附加的進度欄位（`reviewed` 代表已撰寫摘要，`pending` 代表尚待核對），可由舊版忽略。詳細 JSON 的 `source` 是人工參考資料網址，不會在載入角色時自動抓取外部資料。`portrait` 若無可用素材請保留空字串，網頁會顯示元素抽象圖形備援；若改用圖片，需取得對應使用許可並記錄署名及來源。

目前 14 位已整理天賦角色：**芙寧娜、那維萊特、納西妲、雷電將軍、楓原萬葉、鍾離、阿蕾奇諾、神里綾華、胡桃、宵宮、溫迪、行秋、香菱、夜蘭**。前八位沿用前一版已整理的技能摘要；後六位在本版新增。技能文字為非逐字改寫的玩法摘要，未提供天賦等級倍率或完整戰鬥機制；若後續遊戲版本變動，需要重新核對。

## 資料參考與素材權利

- 主要指定參考站：[HoYoLAB 原神 Wiki 繁體中文角色圖鑑](https://wiki.hoyolab.com/pc/genshin/aggregate/character?lang=zh-tw)，此頁的自動化擷取可能受限；**不代表已對本站 122 位角色全部逐條由該網站核對**。
- 角色索引資料的主要交叉參考：[原神工具站角色圖鑑](https://myaline.top/tw/tools/genshin/codex)，包含角色元素、武器及稀有度；新資料仍需與遊戲內資料核對。
- 7.2 版本時點：[HoYoverse 7.2 維護公告（繁中）](https://genshin.hoyoverse.com/zh-tw/news/detail/167131)；[7.2 第一期祈願公告（繁中）](https://genshin.hoyoverse.com/zh-tw/news/detail/167139)，確認米提亞、瓦列里已加入版本。
- 本版新增的六位已整理角色（繁中技能名稱／效果）：[胡桃](https://genshin-center.com/zh-Hant/characters/hutao)、[宵宮](https://genshin-center.com/zh-Hant/characters/yoimiya)、[溫迪](https://genshin-center.com/zh-Hant/characters/venti)、[行秋](https://genshin-center.com/zh-Hant/characters/xingqiu)、[香菱](https://genshin-center.com/zh-Hant/characters/xiangling)、[夜蘭](https://genshin-center.com/zh-Hant/characters/yelan)。
- 先前八位已整理角色的來源在各自 `data/characters/<id>.json` 的 `source` 欄位中列出。內容以自寫摘要呈現，不大量搬運第三方原始段落。
- `assets/characters/placeholder-*.svg` 為本站此前建立的**原創通用人物示意剪影**，非官方立繪；其餘角色顯示本站 CSS 製作的抽象元素圖案。沒有下載、內嵌或未經允許轉存 HoYoLAB 官方圖片、遊戲角色插畫或技能圖示。
- 《原神》名稱、角色名稱及遊戲相關設定歸原權利人所有；本站為非官方學習用途，不代表 HoYoverse 背書或授權。

## 已完成的測試與限制

**2026-11-10，本機：**

- 122 份角色 JSON 與角色索引一致，ID 無重複、欄位結構正確；3 份 JavaScript 通過 `node --check`。
- 22/22 個 Chromium **離線渲染互動測試**成功，包含首頁顯示 24 筆、顯示更多、名稱搜尋、四五星篩選、資料狀態篩選、零結果重設、芙寧娜與胡桃詳頁、技能切換、米提亞待補提示、手機版水平溢出、JSON 404 錯誤提示。
- 本執行環境的 Chromium 禁止直接導覽本機 HTTP 網站，因此測試透過**注入原始 HTML、CSS、同一份 JS 邏輯及 JSON 資料至瀏覽器**進行；不能視為正式模組網頁的 HTTP 端到端測試。請在自己電腦以 HTTP 伺服器或 GitHub Pages 實際複驗。
- 尚待完成：108 位角色技能名稱／摘要、取得可合法公開的角色立繪與技能圖示、實際 GitHub Pages 發布環境的測試。上述限制與 `AGENTS.md` 的「資料不得捏造」原則一致。
