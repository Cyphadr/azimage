# 复古宋体字体配置说明

## 📖 概述

中式复古主题现已更新为**复古宋体风格**，使用以下字体组合：

1. **朱雀仿宋**（主力复古宋体，本地字体）
2. **思源宋体**（Source Han Serif SC，CDN 备选）
3. **系统宋体**（SimSun，最终备选）

## 🎨 字体特色

### 朱雀仿宋 Zhuque Fangsong ⭐ 主力字体

- **设计背景**：改刻自民国1932年"百宋铸字印刷局"推出的仿宋活字"南宋"
- **设计师**：韩佑之（原稿）、邹根培（雕刻）
- **现代改编**：璇玑造字团队（2025年）
- **风格特点**：
  - 中宫收紧，重心略靠右下
  - 撇捺舒展，笔画粗细变化强烈
  - 含蓄秀美而充满力量感
  - 浓厚的"书卷气"与民国活字韵味
- **授权**：OFL 1.1（完全免费商用）
- **字符覆盖**：11,000+ 汉字（v0.200）

### 思源宋体 Source Han Serif SC

- **设计背景**：Adobe 开源宋体字体
- **风格特点**：清晰易读，现代宋体风格
- **授权**：OFL 1.1（完全免费商用）
- **加载方式**：jsDelivr CDN（自动加载）

## 📥 下载朱雀仿宋字体

### 方式一：GitHub 官方（推荐）

访问朱雀仿宋 GitHub 仓库：
- **GitHub**：https://github.com/TrionesType/zhuque
- **镜像仓库**：https://atomgit.com/TrionesType/zhuque

在 [Releases 页面](https://github.com/TrionesType/zhuque/releases) 下载最新版本。

### 方式二：直接下载链接

下载最新版本（v0.200 或更高）：

1. 访问：https://github.com/TrionesType/zhuque/releases/latest
2. 下载 `ZhuqueFangsong-Regular.ttf`（常规字重）
3. 下载 `ZhuqueFangsong-Medium.ttf`（中等字重，如有）

## 📂 安装字体文件

### 步骤 1：创建 fonts 目录

在项目根目录（`az/` 文件夹）下创建 `fonts` 文件夹：

```
az/
├── css/
├── fonts/          ← 创建这个文件夹
│   ├── ZhuqueFangsong-Regular.ttf
│   ├── ZhuqueFangsong-Regular.woff2
│   └── ...
├── preview.html
└── ...
```

### 步骤 2：放置字体文件

将下载的朱雀仿宋字体文件放入 `fonts/` 目录：

**推荐文件名**：
- `ZhuqueFangsong-Regular.ttf`（必需）
- `ZhuqueFangsong-Regular.woff2`（可选，网页优化格式）
- `ZhuqueFangsong-Medium.ttf`（可选，中等字重）

**注意**：
- TTF 格式是必需的，可以直接使用
- WOFF2 格式是可选的，但可提升网页加载速度
- 如果下载的字体文件名不同，请重命名为上述名称，或修改 `css/az-theme-retro-fonts.css` 中的文件路径

### 步骤 3：转换为 WOFF2 格式（可选）

如果官方只提供 TTF 格式，您可以转换为 WOFF2 以优化加载速度：

**在线转换工具**：
- CloudConvert：https://cloudconvert.com/ttf-to-woff2
- Font Squirrel：https://www.fontsquirrel.com/tools/webfont-generator
- Transfonter：https://transfonter.org/

**命令行转换**（需安装 fonttools）：
```bash
pip install fonttools brotli
pyftsubset ZhuqueFangsong-Regular.ttf --flavor=woff2 --output-file=ZhuqueFangsong-Regular.woff2
```

## 🎯 使用方法

### 查看效果

1. 确保字体文件已放入 `fonts/` 目录
2. 在浏览器中打开 `preview.html`
3. 点击右上角"**中式复古**"按钮切换主题
4. 查看字体效果

### 字体加载优先级

系统会按以下顺序尝试加载字体：

1. **朱雀仿宋（本地）** ← 如果 `fonts/` 目录有文件
2. **朱雀仿宋（系统安装）** ← 如果您在操作系统中安装了此字体
3. **思源宋体（CDN）** ← 自动从 jsDelivr 加载
4. **Noto Serif SC** ← Google Fonts 备选
5. **SimSun（宋体）** ← 系统自带字体

### 验证字体是否加载

1. 打开 `preview.html`
2. 按 `F12` 打开浏览器开发者工具
3. 切换到"**Network**"标签
4. 筛选"**Font**"类型
5. 刷新页面，查看是否加载了 `ZhuqueFangsong` 字体

## 🔧 高级配置

### 修改字体文件路径

如果您的字体文件名或路径不同，请编辑 `css/az-theme-retro-fonts.css`：

```css
@font-face {
  font-family: 'Zhuque Fangsong';
  src: url('../fonts/你的字体文件名.woff2') format('woff2');
}
```

### 仅使用 CDN 字体（不使用本地字体）

如果您不想下载本地字体，可以注释掉 `az-theme-retro-fonts.css` 中的朱雀仿宋配置，系统会自动使用思源宋体 CDN。

### 自定义字体优先级

修改 `css/az-theme.css` 中 `chinese-retro` 主题的 `--font-family` 变量：

```css
[data-theme="chinese-retro"] {
  --font-family: "你的字体", "Zhuque Fangsong", "Source Han Serif SC", serif;
}
```

## ❓ 常见问题

### Q1: 为什么本地字体没有加载？

**检查清单**：
1. ✅ 字体文件是否在 `fonts/` 目录下？
2. ✅ 文件名是否正确（`ZhuqueFangsong-Regular.ttf` 等）？
3. ✅ 浏览器是否支持该字体格式？
4. ✅ 路径是否正确（相对于 CSS 文件）？

### Q2: 思源宋体 CDN 加载慢怎么办？

思源宋体通过 jsDelivr CDN 加载，如果速度较慢：
1. 可以下载思源宋体到本地 `fonts/` 目录
2. 在 `az-theme-retro-fonts.css` 中添加本地路径配置

### Q3: 可以只使用系统宋体吗？

可以！在 `css/az-theme.css` 中修改：

```css
[data-theme="chinese-retro"] {
  --font-family: "SimSun", "宋体", serif;
}
```

### Q4: 朱雀仿宋可以商用吗？

完全可以！朱雀仿宋采用 OFL 1.1 授权，支持：
- ✅ 免费商用（印刷、LOGO、软件、网页、视频等）
- ✅ 复制与再分发
- ❌ 单独销售字体原始版本或修改版本

## 📚 参考资源

### 朱雀仿宋官方资源
- GitHub 仓库：https://github.com/TrionesType/zhuque
- 璇玑造字官网：https://www.trionestype.com
- 设计故事与文档：https://github.com/TrionesType/zhuque#设计故事

### 思源宋体官方资源
- Adobe GitHub：https://github.com/adobe-fonts/source-han-serif
- jsDelivr CDN：https://cdn.jsdelivr.net/npm/cn-fontsource-source-han-serif-sc-vf-regular/

### 字体转换工具
- CloudConvert：https://cloudconvert.com/ttf-to-woff2
- Transfonter：https://transfonter.org/
- Font Squirrel：https://www.fontsquirrel.com/tools/webfont-generator

## 🎁 捐赠支持

如果朱雀仿宋帮助到了您，欢迎通过以下方式支持项目：
- 访问官方 GitHub 仓库查看捐赠信息
- 收款方：智琮科技
- 备注：捐赠朱雀

---

**更新日期**：2026-02-13  
**配置文件**：`css/az-theme-retro-fonts.css`  
**主题配置**：`css/az-theme.css`（`chinese-retro` 部分）
