# HTMLSlide

HTMLSlide 是面向 HTML 演示文稿的公开打包格式，用于让外部 PPT skill、AI agent、模板生成器输出的 HTML PPT 可以稳定导入 Tosea HTML Presenter。

它解决的问题是：不同 skill 产出的 HTML PPT 结构不一致，用户很难统一上传、分享和离线播放。HTMLSlide 把格式统一为：

- 一个 `htmlslide.json` 清单文件
- 多个独立的 `slides/slide_001.html` 页面
- 本地图片、CSS、JS、字体等 `assets/`
- 一个可上传的 zip 包

## 快速开始

```bash
git clone https://github.com/ToseaAI/HTMLSlice.git HTMLSlide
cd HTMLSlide
npm run validate
npm run pack
```

生成的示例包在：

```text
dist/htmlslide-basic-demo.zip
```

可以上传到：

```text
https://tosea.ai/tools/html-presenter
```

## 推荐结构

```text
my-deck.zip
├── htmlslide.json
├── slides/
│   ├── slide_001.html
│   ├── slide_002.html
│   └── slide_003.html
└── assets/
    ├── brand.css
    └── chart.svg
```

## 给 Skill 作者的要求

如果你的 skill 当前输出一个完整的 `index.html`，建议在导出阶段完成这些步骤：

1. 把每一页拆成独立的 `slides/slide_001.html`、`slides/slide_002.html`。
2. 把本地图片、CSS、JS、字体、JSON 数据放入 `assets/`。
3. 把每页里的资源引用改为相对路径，例如 `../assets/chart.svg`。
4. 写入 `htmlslide.json`，声明标题、画布尺寸、播放顺序。
5. 打成 zip，上传到 Tosea HTML Presenter。

详细规范见 [SPEC.md](SPEC.md)，转换指南见 [docs/skill-author-guide.md](docs/skill-author-guide.md)。

