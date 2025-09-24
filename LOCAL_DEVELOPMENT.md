# 本地开发指南

## 🚀 快速开始

### 方法一：一键启动（推荐）
```bash
npm run local
```
这个命令会同时启动代理服务器和前端服务器。

### 方法二：分别启动
```bash
# 终端1：启动代理服务器
npm run proxy

# 终端2：启动前端服务器
npm start
```

## 🔧 环境配置

### 1. 设置API密钥

**方法A：环境变量（推荐）**
```bash
# macOS/Linux
export OPENAI_API_KEY=your_api_key_here

# Windows
set OPENAI_API_KEY=your_api_key_here
```

**方法B：创建.env文件**
```bash
# 创建.env文件
echo "OPENAI_API_KEY=your_api_key_here" > .env
```

### 2. 验证配置
```bash
# 检查环境变量
echo $OPENAI_API_KEY
```

## 📱 访问应用

- **前端应用**: http://localhost:3000
- **代理服务器**: http://localhost:3001
- **健康检查**: http://localhost:3001/api/health

## 🔄 智能API端点

应用会自动检测环境：

- **本地开发**: 使用 `http://localhost:3001/api/chat`
- **Netlify部署**: 使用 `/.netlify/functions/chat`
- **其他环境**: 默认使用Netlify Function

## 🛠️ 开发工具

### 可用脚本
```bash
npm run local    # 一键启动本地开发环境
npm run proxy    # 只启动代理服务器
npm start        # 只启动前端服务器
npm run dev      # 开发模式（带文件监听）
npm run build    # 构建生产版本
```

### 调试技巧
1. **检查代理服务器状态**:
   ```bash
   curl http://localhost:3001/api/health
   ```

2. **测试API调用**:
   ```bash
   curl -X POST http://localhost:3001/api/chat \
     -H "Content-Type: application/json" \
     -d '{"model": "gpt-3.5-turbo", "messages": [{"role": "user", "content": "Hello"}]}'
   ```

3. **查看日志**:
   - 代理服务器日志会在终端显示
   - 前端错误在浏览器控制台查看

## 🚨 常见问题

### 1. 代理服务器启动失败
```bash
# 检查依赖是否安装
npm install

# 检查端口是否被占用
lsof -i :3001
```

### 2. API密钥未配置
```bash
# 检查环境变量
echo $OPENAI_API_KEY

# 如果为空，设置环境变量
export OPENAI_API_KEY=your_key_here
```

### 3. CORS错误
- 确保代理服务器在3001端口运行
- 检查前端是否在3000端口访问

## 📦 部署到Netlify

1. **推送代码到GitHub**
2. **在Netlify Dashboard设置环境变量**:
   - `OPENAI_API_KEY` = 您的API密钥
3. **部署会自动开始**

## 🔄 本地和云端切换

应用会自动检测环境：
- 在 `localhost` 或 `127.0.0.1` 上运行时使用本地代理
- 在 `netlify.app` 域名上运行时使用Netlify Function
- 其他环境默认使用Netlify Function

无需手动修改代码！
