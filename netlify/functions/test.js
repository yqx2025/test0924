exports.handler = async (event, context) => {
    return {
        statusCode: 200,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
        },
        body: JSON.stringify({ 
            message: 'Netlify Function is working!',
            timestamp: new Date().toISOString(),
            hasApiKey: !!process.env.OPENAI_API_KEY
        })
    };
};
