exports.handler = async (event, context) => {
    console.log('chat-test 被调用:', event.httpMethod, event.body);
    
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

    try {
        const body = JSON.parse(event.body || '{}');
        console.log('解析的请求体:', body);
        
        return {
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: JSON.stringify({
                message: 'chat-test 成功',
                receivedData: body,
                hasApiKey: !!process.env.OPENAI_API_KEY,
                timestamp: new Date().toISOString()
            })
        };
        
    } catch (error) {
        console.error('chat-test 错误:', error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify({ 
                error: 'chat-test 错误', 
                details: error.message 
            })
        };
    }
};
