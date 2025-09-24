const fetch = require('node-fetch');

module.exports = async (req, res) => {
    // 设置CORS头
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // 处理预检请求
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // 只允许POST请求
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { model, messages, max_tokens } = req.body;
        
        // 从环境变量获取API密钥
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            return res.status(500).json({ 
                error: 'OpenAI API密钥未配置', 
                details: '请在Vercel环境变量中设置OPENAI_API_KEY' 
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
        console.error('API 错误:', error);
        res.status(500).json({ 
            error: '服务器内部错误', 
            details: error.message 
        });
    }
};
