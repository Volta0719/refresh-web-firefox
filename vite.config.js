import copy from 'rollup-plugin-copy'
const path = require("path");
const buildDir = 'build';
const outputFileName = {
    bg: 'store',
    content: 'refreshConfigPage',
    popup: 'popup'
}

module.exports = {
    plugins: [
        copy({
            targets: [
                { src: './popup/index.html', dest: `./${buildDir}/popup/` },
                { src: './_locales', dest: `./${buildDir}/` },
                { src: './icons', dest: `./${buildDir}/` },
                { src: './manifest.json', dest: `./${buildDir}/` },
            ],
            hook: 'writeBundle'
        })
    ],
    build: {
        outDir: `./${buildDir}`,
        rollupOptions: {
            input: {
                bg: path.resolve(__dirname, './bg/store.js'),
                content: path.resolve(__dirname, './content/refreshConfigPage.js'),
                // popup: path.resolve(__dirname, './popup/popup.js'),
                popup: path.resolve(__dirname, './popup.js'),
            },
            output: {
                assetFileNames: (assetInfo) => {
                    return `popup/${assetInfo.name}`
                },
                entryFileNames: (chunkInfo) => {
                    return `${chunkInfo.name}/${outputFileName[chunkInfo.name]}.js`
                },// 打包的文件名
            }
        }
    }
}