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

        // 计算八字
        this.calculateBaziPillars(year, month, day, hour);
        
        // 使用AI分析八字
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

    calculateBaziPillars(year, month, day, hour) {
        // 真正的八字计算算法
        const ganList = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
        const zhiList = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];

        // 年柱计算（以立春为界，这里简化处理）
        const yearGan = (year - 4) % 10;
        const yearZhi = (year - 4) % 12;
        
        // 月柱计算（根据年干推算月干）
        const monthGan = (yearGan * 2 + parseInt(month)) % 10;
        const monthZhi = (parseInt(month) - 1) % 12;
        
        // 日柱计算（使用更准确的算法）
        const date = new Date(year, month - 1, day);
        // 使用1900年1月31日作为基准日（甲子日）
        const baseDate = new Date(1900, 0, 31);
        const daysDiff = Math.floor((date - baseDate) / (1000 * 60 * 60 * 24));
        const dayGan = (daysDiff + 0) % 10;
        const dayZhi = (daysDiff + 0) % 12;
        
        // 时柱计算（根据日干推算时干）
        const hourGan = (dayGan * 2 + Math.floor(parseInt(hour) / 2)) % 10;
        const hourZhi = Math.floor(parseInt(hour) / 2) % 12;

        // 显示计算结果
        document.getElementById('yearGan').textContent = ganList[yearGan];
        document.getElementById('yearZhi').textContent = zhiList[yearZhi];
        document.getElementById('monthGan').textContent = ganList[monthGan];
        document.getElementById('monthZhi').textContent = zhiList[monthZhi];
        document.getElementById('dayGan').textContent = ganList[dayGan];
        document.getElementById('dayZhi').textContent = zhiList[dayZhi];
        document.getElementById('hourGan').textContent = ganList[hourGan];
        document.getElementById('hourZhi').textContent = zhiList[hourZhi];
    }

    analyzeBaziWithAI(birthInfo) {
        const prompt = `请分析以下八字信息：
姓名：${birthInfo.name || '未填写'}
性别：${birthInfo.gender || '未选择'}
出生时间：${birthInfo.year}年${birthInfo.month}月${birthInfo.day}日${this.getHourName(birthInfo.hour)}
出生地点：${birthInfo.place || '未填写'}

请提供详细的八字分析，包括五行分析、十神分析、性格特征、事业财运、感情婚姻、健康运势、大运流年和综合建议。`;

        // 并行请求多个分析
        this.requestAIAnswer({ type: 'wuxing', prompt, targetId: 'wuxingContent' });
        this.requestAIAnswer({ type: 'shishen', prompt, targetId: 'shishenContent' });
        this.requestAIAnswer({ type: 'personality', prompt, targetId: 'personalityContent' });
        this.requestAIAnswer({ type: 'career', prompt, targetId: 'careerContent' });
        this.requestAIAnswer({ type: 'relationship', prompt, targetId: 'relationshipContent' });
        this.requestAIAnswer({ type: 'health', prompt, targetId: 'healthContent' });
        this.requestAIAnswer({ type: 'dayun', prompt, targetId: 'dayunContent' });
        this.requestAIAnswer({ type: 'comprehensive', prompt, targetId: 'comprehensiveContent' });
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
                    model: 'gpt-4o',
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
                    max_tokens: 1000
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            const aiResponse = data.choices[0].message.content;

            if (target) {
                target.innerHTML = `<div class="ai-response">${aiResponse}</div>`;
            }

        } catch (error) {
            console.error('AI请求失败:', error);
            if (target) {
                target.innerHTML = '<div class="error">AI分析暂时不可用，请稍后再试</div>';
            }
        }
    }
}

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', () => {
    new FortuneApp();
});
