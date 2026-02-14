# 字体文件目录

此目录用于存放本地字体文件。

## 推荐字体文件

将以下字体文件放入此目录以获得最佳效果：

### 朱雀仿宋（必需，用于中式复古主题）

从 GitHub 下载：https://github.com/TrionesType/zhuque/releases

**推荐文件**：
- `ZhuqueFangsong-Regular.ttf` - 常规字重（必需）
- `ZhuqueFangsong-Regular.woff2` - Web 优化格式（推荐）
- `ZhuqueFangsong-Medium.ttf` - 中等字重（可选）

### 文件结构示例

```
fonts/
├── ZhuqueFangsong-Regular.ttf
├── ZhuqueFangsong-Regular.woff2
├── ZhuqueFangsong-Medium.ttf
└── README.md (本文件)
```

## 如何获取字体

1. 访问 https://github.com/TrionesType/zhuque/releases
2. 下载最新版本（v0.200 或更高）
3. 解压下载的文件
4. 将 `.ttf` 文件复制到此目录

## 格式转换（可选）

如果需要 WOFF2 格式以优化网页加载速度，可使用在线工具转换：
- CloudConvert: https://cloudconvert.com/ttf-to-woff2
- Transfonter: https://transfonter.org/

## 注意事项

- ⚠️ **不要修改文件名**：CSS 文件中已配置好文件名，请保持一致
- ⚠️ **版权说明**：朱雀仿宋采用 OFL 1.1 授权，可免费商用
- ℹ️ **如果不安装本地字体**：系统会自动使用思源宋体 CDN 作为备选

## 更多信息

详细的字体安装和配置说明，请查看项目根目录的 `fonts-setup-guide.md` 文件。
