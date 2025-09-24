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

// DeepSeek API 代理端点
app.post('/api/chat', async (req, res) => {
    try {
        const { model, messages, max_tokens } = req.body;
        
        // 从环境变量获取API密钥
        const apiKey = process.env.DEEPSEEK_API_KEY;
        
            if (!apiKey) {
                return res.status(500).json({ 
                    error: 'DeepSeek API密钥未配置', 
                    details: '请在环境变量中设置DEEPSEEK_API_KEY' 
                });
            }
        
            const response = await fetch('https://api.deepseek.com/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: model || 'deepseek-chat',
                    messages: messages || [],
                    max_tokens: max_tokens || 2000,
                    temperature: 0.7,
                    stream: true
                })
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error('DeepSeek API 错误:', response.status, errorText);
                return res.status(response.status).json({ 
                    error: 'DeepSeek API 请求失败', 
                    details: errorText 
                });
            }

            // 处理流式响应
            if (response.body && response.body.getReader) {
                // 读取流式响应并累积
                const reader = response.body.getReader();
                const decoder = new TextDecoder();
                let fullContent = '';
                
                while (true) {
                    const { done, value } = await reader.read();
                    if (done) break;
                    
                    const chunk = decoder.decode(value);
                    
                    // 解析SSE数据
                    const lines = chunk.split('\n');
                    for (const line of lines) {
                        if (line.startsWith('data: ')) {
                            const data = line.slice(6);
                            if (data.trim() === '[DONE]') continue;
                            try {
                                const parsed = JSON.parse(data);
                                if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
                                    fullContent += parsed.choices[0].delta.content;
                                }
                            } catch (e) {
                                // 忽略解析错误
                            }
                        }
                    }
                }
                
                // 返回完整的响应，模拟非流式格式
                res.json({
                    choices: [{
                        message: {
                            content: fullContent,
                            role: 'assistant'
                        },
                        finish_reason: 'stop'
                    }]
                });
            } else {
                // 降级处理：如果不支持流式，读取普通响应
                const data = await response.json();
                res.json(data);
            }
        
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
        console.log(`DeepSeek 代理: http://localhost:${PORT}/api/chat`);
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
