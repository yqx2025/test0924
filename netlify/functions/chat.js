// DeepSeek API Netlify Function
// 使用原生fetch（Node.js 18+支持）

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
        const apiKey = process.env.DEEPSEEK_API_KEY;
        
            if (!apiKey) {
                console.error('API密钥未配置');
                return {
                    statusCode: 500,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ 
                        error: 'DeepSeek API密钥未配置', 
                        details: '请在Netlify环境变量中设置DEEPSEEK_API_KEY' 
                    })
                };
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
                return {
                    statusCode: response.status,
                    headers: {
                        'Access-Control-Allow-Origin': '*'
                    },
                    body: JSON.stringify({ 
                        error: 'DeepSeek API 请求失败', 
                        details: errorText 
                    })
                };
            }

            // 读取流式响应并累积
            const reader = response.body.getReader();
            const decoder = new TextDecoder();
            let result = '';
            let fullContent = '';
            
            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                
                const chunk = decoder.decode(value);
                result += chunk;
                
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
            return {
                statusCode: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Headers': 'Content-Type',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS'
                },
                body: JSON.stringify({
                    choices: [{
                        message: {
                            content: fullContent,
                            role: 'assistant'
                        },
                        finish_reason: 'stop'
                    }]
                })
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
