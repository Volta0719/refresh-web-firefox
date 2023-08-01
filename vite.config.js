const path = require("path");
const buildDir = 'build';

module.exports = {
    build:{
        outDir:`./${buildDir}`,
        rollupOptions:{
            input:{
                store:path.resolve(__dirname,'./bg/store.js'),
                content:path.resolve(__dirname,'./content/refreshConfigPage.js')
            },
            output:{
                entryFileNames: "[name]/[name].js",// 打包的文件名
                assetFileNames:"[name]",
                chunkFileNames:"[name].js"
            }

        }
        
    }
}