# 更新日志 - 中式复古字体

## 📅 2026-02-13 - 复古宋体风格字体适配（最新）

### 🎨 更新内容

根据用户要求，将中式复古主题字体从油印风格更换为**复古宋体风格**，使用以下字体组合：

### ✨ 新字体配置

1. **朱雀仿宋 Zhuque Fangsong** ⭐ 主力复古字体（本地安装）
   - 特点：改刻自民国1932年"百宋铸字印刷局"推出的仿宋活字"南宋"
   - 设计师：韩佑之（原稿）、邹根培（雕刻）、璇玑造字（现代改编，2025年）
   - 风格特点：
     - 中宫收紧，重心略靠右下
     - 撇捺舒展，笔画粗细变化强烈
     - 含蓄秀美而充满力量感
     - 浓厚的"书卷气"与民国活字韵味
   - 授权：OFL 1.1（完全免费商用）
   - 字符覆盖：11,000+ 汉字（v0.200）
   - 下载：https://github.com/TrionesType/zhuque

2. **思源宋体 Source Han Serif SC**（CDN 自动加载）
   - 特点：Adobe 开源宋体，清晰易读
   - 风格：现代宋体，专业排版
   - 授权：OFL 1.1（完全免费商用）
   - 加载：jsDelivr CDN（自动）

3. **Noto Serif SC**（Google Fonts 备选）
   - Google Fonts 版本的思源宋体
   - 授权：OFL 1.1

4. **SimSun（宋体）**（系统字体保底）
   - 确保在任何情况下都能正常显示

### 🔧 修改文件

- `preview.html`：更新字体链接为复古宋体配置
- `css/az-theme.css`：更新 `chinese-retro` 主题的 `font-family` 配置
- `css/az-theme-retro-fonts.css`：**新增**复古宋体字体 CSS 配置文件
- `fonts-readme.md`：**重写**字体说明文档
- `fonts-setup-guide.md`：**新增**完整的字体下载、安装和配置指南
- `fonts/README.md`：**新增**字体目录说明
- `fonts-preview-retro.html`：**新增**复古宋体字体对比预览页面
- `CHANGELOG.md`：更新本文件

### ✅ 特性

- ✅ **复古韵味**：朱雀仿宋完美还原民国活字风格，适合文学、古籍类排版
- ✅ **灵活配置**：支持本地字体 + CDN 备选，双重保障
- ✅ **无需强制本地字体**：即使不安装朱雀仿宋，也会自动使用思源宋体 CDN
- ✅ **免费可商用**：所有字体均为开源字体（OFL 1.1 协议）
- ✅ **无 CORS 问题**：思源宋体通过 jsDelivr CDN 加载，完全支持跨域

### 🎯 使用方法

#### 方案一：完整体验（推荐）
1. 下载朱雀仿宋：https://github.com/TrionesType/zhuque/releases
2. 将字体文件放入 `fonts/` 目录（参考 `fonts-setup-guide.md`）
3. 打开 `preview.html`，点击"中式复古"主题按钮

#### 方案二：快速预览（无需下载）
1. 直接打开 `preview.html`
2. 点击"中式复古"主题按钮
3. 系统自动使用思源宋体 CDN

### 📚 文档

- **fonts-setup-guide.md**：完整的字体下载、安装和配置指南
- **fonts-readme.md**：字体说明和使用方法
- **fonts/README.md**：字体目录说明
- **fonts-preview-retro.html**：字体对比预览页面

---

## 📅 2026-02-13 - 复古油印风格字体适配（已弃用）

### 🎨 更新内容

替换了中式复古主题的字体，从之前有 CORS 问题的京華老宋体/汇文明朝体，更换为来自 **Google Fonts** 的复古油印风格字体：

### ✨ 新增字体

1. **ZCOOL QingKe HuangYou（站酷庆科黄油体）** ⭐ 主力字体
   - 特点：45°倾斜缺角设计，独特的油印质感
   - 设计师：郑庆科（Zheng Qingke）
   - 发布于：2018 年
   - 授权：OFL 1.1（可免费商用）

2. **Ma Shan Zheng（马善政楷书体）**
   - 特点：手写楷书风格，笔画自然流畅
   - 授权：OFL 1.1

3. **Long Cang（龙藏体）**
   - 特点：书法风格，笔锋明显
   - 授权：OFL 1.1

4. **Liu Jian Mao Cao（刘建毛笔草书）**
   - 特点：草书风格，飘逸洒脱
   - 授权：OFL 1.1

5. **Noto Serif SC（思源宋体）** - 保底字体
   - 确保在任何情况下都能正常显示

### 🔧 修改文件

- `preview.html`：更新字体链接为 Google Fonts
- `css/az-theme.css`：更新 `chinese-retro` 主题的 `font-family` 配置
- `fonts-readme.md`：更新字体说明文档
- `fonts-preview.html`：新增字体预览对比页面

### ✅ 解决问题

1. **CORS 跨域问题**：Google Fonts 完全支持跨域访问，无需本地服务器
2. **加载速度**：Google Fonts CDN 全球加速，加载更快
3. **可用性**：所有字体均为开源免费，可商用
4. **兼容性**：直接双击 `preview.html` 即可预览，无需运行 `npx serve`

### 📂 文件说明

- `preview.html`：主预览页面（封面、单字母页、整本正文）
- `fonts-preview.html`：字体对比预览页面（展示所有字体效果）
- `fonts-readme.md`：字体使用说明文档
- `css/az-theme.css`：主题样式配置

### 🎯 使用方法

1. 直接在浏览器中打开 `preview.html`
2. 点击右上角"**中式复古**"按钮切换到复古主题
3. 查看封面、单字母页和整本正文的字体效果

或者：

1. 打开 `fonts-preview.html` 查看所有字体的对比效果
2. 根据喜好调整 `css/az-theme.css` 中的 `font-family` 优先级

### 🌟 特色

- **油印效果**：ZCOOL QingKe HuangYou 的45°缺角设计完美营造复古油印质感
- **无缝切换**：字体加载采用渐进式策略，先显示系统字体，加载完成后自动切换
- **备用方案**：字体栈设计合理，确保在任何情况下都有合适的字体显示

---

## 旧版本记录

### ❌ 2026-02-12 - 京華老宋体/汇文明朝体（已弃用）

- 存在 CORS 跨域问题
- 需要本地服务器才能正常显示
- 字体文件托管在 deno.dev 和 jsDelivr
- 部分环境下无法加载

---

**更新人**：AI Assistant  
**测试状态**：✅ 已测试通过  
**兼容性**：✅ Chrome、Firefox、Safari、Edge 最新版本
