#!/usr/bin/env node

const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 启动本地开发环境...\n');

// 检查依赖是否安装
const fs = require('fs');
const packageJson = require('./package.json');
const nodeModulesPath = path.join(__dirname, 'node_modules');

if (!fs.existsSync(nodeModulesPath)) {
    console.log('📦 安装依赖包...');
    const npm = spawn('npm', ['install'], { stdio: 'inherit', shell: true });
    npm.on('close', (code) => {
        if (code === 0) {
            startServers();
        } else {
            console.error('❌ 依赖安装失败');
            process.exit(1);
        }
    });
} else {
    startServers();
}

function startServers() {
    console.log('🔧 启动代理服务器...');
    const proxyServer = spawn('node', ['proxy-server.js'], { 
        stdio: 'pipe', 
        shell: true,
        env: { ...process.env, OPENAI_API_KEY: process.env.OPENAI_API_KEY || '' }
    });

    proxyServer.stdout.on('data', (data) => {
        console.log(`[代理服务器] ${data.toString().trim()}`);
    });

    proxyServer.stderr.on('data', (data) => {
        console.error(`[代理服务器错误] ${data.toString().trim()}`);
    });

    // 等待代理服务器启动
    setTimeout(() => {
        console.log('🌐 启动前端服务器...');
        const frontendServer = spawn('npm', ['start'], { 
            stdio: 'inherit', 
            shell: true 
        });

        frontendServer.on('close', (code) => {
            console.log(`前端服务器退出，代码: ${code}`);
        });
    }, 2000);

    // 优雅关闭
    process.on('SIGINT', () => {
        console.log('\n🛑 正在关闭服务器...');
        proxyServer.kill();
        process.exit(0);
    });

    process.on('SIGTERM', () => {
        console.log('\n🛑 正在关闭服务器...');
        proxyServer.kill();
        process.exit(0);
    });
}
