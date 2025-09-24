const express = require('express');
const cors = require('cors');
require('dotenv').config();

// 使用原生fetch（Node.js 18+支持）
const fetch = globalThis.fetch || require('node-fetch');

const app = express();
const PORT = 3001;

// 中间件
app.use(cors());
app.use(express.json());

// OpenAI API 代理端点
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, max_tokens } = req.body;
        
        // 从环境变量获取API密钥
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'OpenAI API密钥未配置', 
                details: '请在环境变量中设置OPENAI_API_KEY' 
            });
        }
        
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: model || 'gpt-4o',
                messages: messages || [],
                max_tokens: max_tokens || 1000,
                temperature: 0.7
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('OpenAI API 错误:', response.status, errorText);
            return res.status(response.status).json({ 
                error: 'OpenAI API 请求失败', 
                details: errorText 
            });
        }

        const data = await response.json();
        res.json(data);
        
    } catch (error) {
        console.error('代理服务器错误:', error);
        res.status(500).json({ 
            error: '服务器内部错误', 
            details: error.message 
        });
    }
});

// 健康检查端点
app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'ok', 
        timestamp: new Date().toISOString(),
        message: '代理服务器运行正常'
    });
});

// 启动服务器
app.listen(PORT, () => {
    console.log(`代理服务器运行在 http://localhost:${PORT}`);
    console.log(`健康检查: http://localhost:${PORT}/api/health`);
    console.log(`OpenAI 代理: http://localhost:${PORT}/api/chat`);
});

// 优雅关闭
process.on('SIGINT', () => {
    console.log('\n正在关闭代理服务器...');
    process.exit(0);
});

process.on('SIGTERM', () => {
    console.log('\n正在关闭代理服务器...');
    process.exit(0);
});
