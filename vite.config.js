import {defineConfig} from 'vite'
import vitePluginImp from "vite-plugin-imp";
const path = require('path')
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        vitePluginImp({
            libList: [
                {
                    libName: 'antd',
                    style: (name) => `antd/es/${name}/style`,
                },
            ],
        }),
    ],
    css: {
        preprocessorOptions: {
            less: {
                modifyVars: {'primary-color': '#1890ff'},
                javascriptEnabled: true,
            },
        },
    },
    resolve:{
        alias:{
            '@':path.resolve(__dirname,'src')
        }
    }
})
