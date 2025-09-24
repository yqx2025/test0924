// 算命应用主脚本
class FortuneApp {
    constructor() {
        this.init();
    }

    init() {
        this.bindEvents();
        this.setupTabs();
    }

    bindEvents() {
        // 导航按钮事件
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.switchTab(e.target.dataset.tab);
            });
        });

        // 小六壬卜卦事件
        document.getElementById('startDivination')?.addEventListener('click', () => {
            this.startDivination();
        });

        document.getElementById('resetDivination')?.addEventListener('click', () => {
            this.resetDivination();
        });

        // 八字计算事件
        document.getElementById('calculateBazi')?.addEventListener('click', () => {
            this.calculateBazi();
        });
    }

    setupTabs() {
        // 默认显示小六壬页面
        this.switchTab('xiaoliuren');
    }

    switchTab(tabName) {
        // 隐藏所有内容
        document.querySelectorAll('.tab-content').forEach(content => {
            content.classList.remove('active');
        });

        // 移除所有按钮的active状态
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.remove('active');
        });

        // 显示选中的内容
        document.getElementById(tabName)?.classList.add('active');
        document.querySelector(`[data-tab="${tabName}"]`)?.classList.add('active');
    }

    startDivination() {
        const question = document.getElementById('question').value.trim();
        if (!question) {
            alert('请输入您要询问的问题');
            return;
        }

        // 显示卜卦过程
        document.getElementById('divinationProcess').classList.remove('hidden');
        
        // 模拟卜卦过程
        setTimeout(() => {
            this.performDivination(question);
        }, 2000);
    }

    performDivination(question) {
        // 生成月将、时辰、起课
        const yuejiang = this.getYuejiang();
        const shichen = this.getShichen();
        const qike = this.getQike();

        // 显示卜卦过程
        document.getElementById('yuejiang').textContent = yuejiang;
        document.getElementById('shichen').textContent = shichen;
        document.getElementById('qike').textContent = qike;

        // 显示结果
        setTimeout(() => {
            this.showDivinationResult(question, { yuejiang, shichen, qike });
        }, 1000);
    }

    getYuejiang() {
        const yuejiangList = ['大安', '留连', '速喜', '赤口', '小吉', '空亡'];
        return yuejiangList[Math.floor(Math.random() * yuejiangList.length)];
    }

    getShichen() {
        const shichenList = ['子时', '丑时', '寅时', '卯时', '辰时', '巳时', '午时', '未时', '申时', '酉时', '戌时', '亥时'];
        return shichenList[Math.floor(Math.random() * shichenList.length)];
    }

    getQike() {
        const qikeList = ['青龙', '朱雀', '勾陈', '腾蛇', '白虎', '玄武'];
        return qikeList[Math.floor(Math.random() * qikeList.length)];
    }

    showDivinationResult(question, divinationData) {
        document.getElementById('divinationResult').classList.remove('hidden');
        
        // 使用AI分析结果
        this.requestAIAnswer({
            type: 'xiaoliuren',
            prompt: `请根据小六壬卜卦结果分析问题：${question}。月将：${divinationData.yuejiang}，时辰：${divinationData.shichen}，起课：${divinationData.qike}`,
            targetId: 'aiDivination'
        });
    }

    resetDivination() {
        document.getElementById('question').value = '';
        document.getElementById('divinationProcess').classList.add('hidden');
        document.getElementById('divinationResult').classList.add('hidden');
    }

    calculateBazi() {
        const name = document.getElementById('baziName').value.trim();
        const gender = document.getElementById('baziGender').value;
        const year = document.getElementById('birthYear').value;
        const month = document.getElementById('birthMonth').value;
        const day = document.getElementById('birthDay').value;
        const hour = document.getElementById('birthHour').value;
        const place = document.getElementById('birthPlace').value.trim();

        if (!year || !month || !day || !hour) {
            alert('请填写完整的出生信息');
            return;
        }

        // 显示结果区域
        document.getElementById('baziResult').classList.remove('hidden');
        
        // 显示基本信息
        document.getElementById('baziNameDisplay').textContent = name || '未填写';
        document.getElementById('baziGenderDisplay').textContent = gender || '未选择';
        document.getElementById('baziBirthTime').textContent = `${year}年${month}月${day}日${this.getHourName(hour)}`;
        document.getElementById('baziBirthPlace').textContent = place || '未填写';

        // 直接使用AI计算和分析八字，不进行本地计算
        this.analyzeBaziWithAI({ name, gender, year, month, day, hour, place });
    }

    getHourName(hour) {
        const hourNames = {
            '23': '子时', '1': '丑时', '3': '寅时', '5': '卯时',
            '7': '辰时', '9': '巳时', '11': '午时', '13': '未时',
            '15': '申时', '17': '酉时', '19': '戌时', '21': '亥时'
        };
        return hourNames[hour] || '未知时辰';
    }


    analyzeBaziWithAI(birthInfo) {
        const currentYear = new Date().getFullYear();
        const age = currentYear - parseInt(birthInfo.year);
        
        const prompt = `请根据以下出生信息计算八字排盘并进行详细分析：

姓名：${birthInfo.name || '未填写'}
性别：${birthInfo.gender || '未选择'}
出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日${this.getHourName(birthInfo.hour)}
出生地点：${birthInfo.place || '未填写'}
当前年龄：${age}岁

请按照以下固定格式提供完整的分析（请勿使用Markdown格式）：

## 八字排盘
- 年柱：[天干][地支]
- 月柱：[天干][地支]  
- 日柱：[天干][地支]
- 时柱：[天干][地支]

## 五行分析
[详细分析五行强弱、缺失、平衡状况]

## 性格特征
[根据八字分析性格特点、优缺点、性情倾向]

## 事业财运
[事业发展方向、财运状况、适合行业]

## 感情婚姻
[感情运势、婚姻状况、配偶特征]

## 健康运势
[身体健康状况、需注意事项、保健建议]

## 大运流年
### 当前大运（${Math.floor(age/10)*10}岁-${Math.floor(age/10)*10+9}岁）
[分析当前这个10年大运的特点和运势]

### ${currentYear}年流年运势
[详细分析今年的运势情况]

请确保八字计算准确，内容专业详细。分析要全面深入，语言通俗易懂。`;

        // 只发送一次完整的请求
        this.requestAIAnswer({ type: 'complete_bazi', prompt, targetId: 'baziPillars' });
    }

    // 智能检测API端点
    getApiEndpoint() {
        // 检测是否在Netlify环境
        if (window.location.hostname.includes('netlify.app')) {
            return '/.netlify/functions/chat';
        }
        // 检测是否在localhost环境
        else if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            return 'http://localhost:3001/api/chat';
        }
        // 默认使用Netlify Function
        else {
            return '/.netlify/functions/chat';
        }
    }

    async requestAIAnswer({ type, prompt, targetId }) {
        const target = document.getElementById(targetId);
        
        try {
            if (target) {
                target.innerHTML = '<div class="loading">AI正在分析中...</div>';
            }

            // 智能检测API端点
            const apiEndpoint = this.getApiEndpoint();
            const response = await fetch(apiEndpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'deepseek-chat',
                    messages: [
                        {
                            role: 'system',
                            content: '你是一位专业的命理师，精通小六壬卜卦和五行八字分析。请用专业、准确、易懂的语言为用户提供分析。'
                        },
                        {
                            role: 'user',
                            content: prompt
                        }
                    ],
                    max_tokens: 4000
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            let aiResponse = data.choices[0].message.content;

            // 将AI响应从Markdown格式转换为HTML格式
            aiResponse = this.formatAIResponse(aiResponse);

            if (target) {
                target.innerHTML = `<div class="ai-response">${aiResponse}</div>`;
                
                // 如果是完整八字分析，显示付费按钮
                if (type === 'complete_bazi') {
                    setTimeout(() => {
                        const paymentSection = document.getElementById('paymentSection');
                        if (paymentSection) {
                            paymentSection.classList.remove('hidden');
                        }
                    }, 1000);
                }
            }

        } catch (error) {
            console.error('AI请求失败:', error);
            if (target) {
                target.innerHTML = '<div class="error">AI分析暂时不可用，请稍后再试</div>';
            }
        }
    }

    // 格式化AI响应，将Markdown转换为HTML
    formatAIResponse(text) {
        if (!text) return '';
        
        // 替换标题格式
        text = text.replace(/^### (.*$)/gm, '<h4 class="ai-subtitle">$1</h4>');
        text = text.replace(/^## (.*$)/gm, '<h3 class="ai-title">$1</h3>');
        text = text.replace(/^# (.*$)/gm, '<h2 class="ai-main-title">$1</h2>');
        
        // 替换粗体
        text = text.replace(/\*\*(.*?)\*\*/g, '<strong class="ai-bold">$1</strong>');
        
        // 替换列表项
        text = text.replace(/^- (.*$)/gm, '<div class="ai-list-item">• $1</div>');
        
        // 替换段落（双换行变成段落分隔）
        text = text.replace(/\n\n/g, '</p><p class="ai-paragraph">');
        
        // 包装整个内容在段落中
        if (!text.startsWith('<h') && !text.startsWith('<div class="ai-list-item">')) {
            text = '<p class="ai-paragraph">' + text + '</p>';
        }
        
        // 处理换行
        text = text.replace(/\n/g, '<br>');
        
        return text;
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new FortuneApp();
});
