const fs = require('fs-extra');
const path = require('path');

async function build() {
    console.log('🚀 开始构建离线版本...');
    
    // 清理并创建 dist 目录
    await fs.emptyDir('dist');
    
    // 复制基本文件
    console.log('📄 复制基本文件...');
    await fs.copy('slides', 'dist/slides');
    await fs.copy('css', 'dist/css');
    await fs.copy('images', 'dist/images');
    if (await fs.pathExists('docs')) {
        await fs.copy('docs', 'dist/docs');
    }
    
    // 从 node_modules 复制 reveal.js 文件
    console.log('📦 复制 reveal.js 文件...');
    const revealSrc = 'node_modules/reveal.js';
    const revealDist = 'dist/reveal.js';
    
    // 复制必要的 reveal.js 文件
    await fs.ensureDir(`${revealDist}/dist`);
    await fs.ensureDir(`${revealDist}/plugin`);
    
    // 复制主要的 CSS 和 JS 文件
    await fs.copy(`${revealSrc}/dist`, `${revealDist}/dist`);
    await fs.copy(`${revealSrc}/plugin`, `${revealDist}/plugin`);
    
    // 创建离线版本的 index.html
    console.log('🔧 创建离线版本的 index.html...');
    let indexContent = await fs.readFile('index.html', 'utf8');
    
    // 替换 CDN 链接为本地路径
    indexContent = indexContent
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/dist\/reveal\.css/g, './reveal.js/dist/reveal.css')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/dist\/theme\/white\.css/g, './reveal.js/dist/theme/white.css')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/highlight\/zenburn\.css/g, './reveal.js/plugin/highlight/zenburn.css')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/dist\/reveal\.js/g, './reveal.js/dist/reveal.js')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/notes\/notes\.js/g, './reveal.js/plugin/notes/notes.js')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/markdown\/markdown\.js/g, './reveal.js/plugin/markdown/markdown.js')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/highlight\/highlight\.js/g, './reveal.js/plugin/highlight/highlight.js')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/zoom\/zoom\.js/g, './reveal.js/plugin/zoom/zoom.js')
        .replace(/https:\/\/cdn\.jsdelivr\.net\/npm\/reveal\.js@5\.2\.1\/plugin\/search\/search\.js/g, './reveal.js/plugin/search/search.js');
    
    await fs.writeFile('dist/index.html', indexContent);
    
    // 复制其他可能的配置文件
    const configFiles = ['_headers', '_redirects', 'netlify.toml'];
    for (const file of configFiles) {
        if (await fs.pathExists(file)) {
            await fs.copy(file, `dist/${file}`);
        }
    }
    
    console.log('✅ 构建完成！');
    console.log('📁 离线版本已生成到 dist/ 目录');
    console.log('🌐 运行 npm run serve:dist 来预览离线版本');
}

build().catch(console.error);
