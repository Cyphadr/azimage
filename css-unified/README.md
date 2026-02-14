# css-unified — 主题变量绑定版

本目录为「同一生成器 + 颜色/字号绑定自定义变量」的 CSS 版本，便于在生成器中通过覆盖 CSS 变量统一控制各主题的配色与字号。

## 文件说明

| 文件 | 说明 |
|------|------|
| `az-theme.css` | 基础主题与组件样式，含 `:root` / 各 `[data-theme]` 变量及封面/正文用 `--color-cover-*`、`--font-size-letter-badge` 等 |
| `az-theme-editorial.css` | 编辑/印刷风，全部使用 `var(--color-primary)` / `var(--color-border)` 等 |
| `az-theme-nippon.css` | 日系主题，含 `--color-deco-accent`、`--color-word-diamond` |
| `az-theme-app.css` | App 主题，边框等使用变量 |
| `az-theme-poster.css` | 复古海报，含 `--color-subtitle-border`、`--color-card-border-soft` 等 |
| `az-theme-vintage.css` | 复古凸版，含 `--font-size-ornament`（装饰用 0.55rem） |
| `az-theme-retro-gui.css` | 复古 GUI，含 `--color-bg-bottom`、`--color-shadow-retro` 等 |
| `az-theme-retro-fonts.css` | 中式复古字体 @font-face（与 css/ 相同） |
| `az-theme-pixel-fonts.css` | 像素字体 @font-face（与 css/ 相同） |

## 使用方式

在 `preview.html` 中把原有 `css/` 的 link 改为指向 `css-unified/` 即可，例如：

```html
<link rel="stylesheet" href="css-unified/az-theme-retro-fonts.css" />
<link rel="stylesheet" href="css-unified/az-theme-pixel-fonts.css" />
<link rel="stylesheet" href="css-unified/az-theme.css" />
<link rel="stylesheet" href="css-unified/az-theme-retro-gui.css" />
<link rel="stylesheet" href="css-unified/az-theme-vintage.css" />
<link rel="stylesheet" href="css-unified/az-theme-poster.css" />
<link rel="stylesheet" href="css-unified/az-theme-app.css" />
<link rel="stylesheet" href="css-unified/az-theme-nippon.css" />
<link rel="stylesheet" href="css-unified/az-theme-editorial.css" />
```

生成器可通过在 `:root` 或对应 `[data-theme="xxx"]` 下覆盖以下变量来统一调节：

- **颜色**：`--color-primary`、`--color-background`、`--color-surface`、`--color-text`、`--color-text-secondary`、`--color-accent`、`--color-accent-2`、`--color-border`，以及封面 `--color-cover-badge`、`--color-cover-title`、`--color-cover-subtitle`、`--color-cover-author` 等
- **字号**：`--font-size-title`、`--font-size-subtitle`、`--font-size-body`、`--font-size-small`，以及 `--font-size-letter-badge`、`--font-size-letter-bg`、`--font-size-full-letter`、`--font-size-full-word`、`--font-size-ornament`（vintage 装饰）等
