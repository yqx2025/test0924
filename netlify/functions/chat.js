const fetch = require('node-fetch');

exports.handler = async (event, context) => {
    // 处理CORS预检请求
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }

    // 只允许POST请求
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ error: 'Method not allowed' })
        };
    }

    try {
        console.log('收到请求:', event.httpMethod, event.body);
        
        const { model, messages, max_tokens } = JSON.parse(event.body);
        
        // 从环境变量获取API密钥
        const apiKey = process.env.OPENAI_API_KEY;
        
        if (!apiKey) {
            console.error('API密钥未配置');
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: 'OpenAI API密钥未配置', 
                    details: '请在Netlify环境变量中设置OPENAI_API_KEY' 
                })
            };
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
            return {
                statusCode: response.status,
                headers: {
                    'Access-Control-Allow-Origin': '*'
                },
                body: JSON.stringify({ 
                    error: 'OpenAI API 请求失败', 
                    details: errorText 
                })
            };
        }

        const data = await response.json();
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify(data)
        };
        
    } catch (error) {
        console.error('Function 错误:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: '服务器内部错误', 
                details: error.message 
            })
        };
    }
};
