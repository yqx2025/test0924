# Netlify 部署指南

## 在Netlify上配置API密钥

### 方法一：通过Netlify Dashboard

1. **登录Netlify**
   - 访问 [netlify.com](https://netlify.com)
   - 登录您的账户

2. **选择项目**
   - 在Dashboard中找到您的项目
   - 点击项目名称进入项目详情

3. **设置环境变量**
   - 点击 "Site settings" → "Environment variables"
   - 点击 "Add variable"
   - 变量名：`OPENAI_API_KEY`
   - 变量值：您的OpenAI API密钥
   - 点击 "Save"

### 方法二：通过Netlify CLI

```bash
# 安装Netlify CLI
npm install -g netlify-cli

# 登录Netlify
netlify login

# 设置环境变量
netlify env:set OPENAI_API_KEY your_api_key_here

# 部署
netlify deploy --prod
```

### 方法三：通过netlify.toml文件

在项目根目录创建或更新 `netlify.toml`：

```toml
[build.environment]
  OPENAI_API_KEY = "your_api_key_here"
```

⚠️ **注意**：这种方法会将API密钥暴露在代码中，不推荐用于生产环境。

## 部署步骤

### 1. 连接GitHub仓库

1. 在Netlify Dashboard点击 "New site from Git"
2. 选择 "GitHub" 作为Git提供商
3. 授权Netlify访问您的GitHub账户
4. 选择仓库 `yqx2025/test0924`
5. 配置构建设置：
   - Build command: `npm run build`
   - Publish directory: `.`
   - Node version: `18`

### 2. 设置环境变量

按照上述方法设置 `OPENAI_API_KEY` 环境变量。

### 3. 部署

- 点击 "Deploy site"
- 等待构建完成
- 访问提供的URL测试应用

## 验证部署

1. **检查Function是否工作**
   - 访问 `https://your-site.netlify.app/.netlify/functions/chat`
   - 应该返回健康检查信息

2. **测试应用功能**
   - 打开应用URL
   - 尝试小六壬卜卦功能
   - 尝试八字计算功能

## 故障排除

### 常见问题

1. **Function 404错误**
   - 检查 `netlify/functions/chat.js` 文件是否存在
   - 确认文件路径正确

2. **API密钥未配置**
   - 检查环境变量是否正确设置
   - 确认变量名拼写正确

3. **CORS错误**
   - 检查Function中的CORS头设置
   - 确认前端请求URL正确

### 调试方法

1. **查看Function日志**
   - 在Netlify Dashboard → Functions → 查看日志

2. **本地测试**
   ```bash
   # 安装Netlify CLI
   npm install -g netlify-cli
   
   # 本地运行
   netlify dev
   ```

3. **检查环境变量**
   ```bash
   # 查看环境变量
   netlify env:list
   ```

## 安全建议

1. **不要将API密钥提交到代码仓库**
2. **使用环境变量管理敏感信息**
3. **定期轮换API密钥**
4. **设置API使用限制**

## 成本优化

1. **设置API使用限制**
   - 在OpenAI Dashboard设置使用限制
   - 监控API使用情况

2. **优化请求频率**
   - 实现请求缓存
   - 避免重复请求

3. **使用更便宜的模型**
   - 对于简单任务使用 `gpt-3.5-turbo`
   - 只在需要时使用 `gpt-4o`
