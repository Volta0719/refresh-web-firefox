const path = require("path");
const buildDir = 'build';
const outputFileName = {
    bg: 'store',
    content: 'refreshConfigPage',
    popup: 'popup'
}
module.exports = {
    build: {
        outDir: `./${buildDir}`,
        rollupOptions: {
            input: {
                bg: path.resolve(__dirname, './bg/store.js'),
                content: path.resolve(__dirname, './content/refreshConfigPage.js'),
                popup: path.resolve(__dirname, './popup/popup.js')
            },
            output: {
                entryFileNames: (chunkInfo) => {
                    return `${chunkInfo.name}/${outputFileName[chunkInfo.name]}.js`
                },// 打包的文件名
            }
        }
    }
}