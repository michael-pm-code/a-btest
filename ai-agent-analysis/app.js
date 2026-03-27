(function () {
  'use strict';

  const QUESTION_PLACEHOLDER = '最近一个月哪个国家/地区付款客户最多？';

  const THINKING_NODES = [
    {
      title: '理解问题',
      summary: '用户想要了解最近一个月各国家/地区的付款客户数据，并对比不同国家/地区客户数及占比；',
    },
    {
      title: '规划分析方案',
      summary: '可直接按照各国家/地区聚合已支付的订单数，然后按顾客去重',
    },
    {
      title: '查询数据',
      summary: '各国付款客户数',
    },
    {
      title: '分析数据',
      summary:
        '在2026年2月19日至3月19日期间，新加坡以9名付款客户排名第一，未知地区紧随其后有8名付款客户。',
    },
  ];

  const ANSWER_PARAGRAPHS = [
    '在2026年2月19日至3月19日期间，新加坡以9名付款客户排名第一，未知地区紧随其后有8名付款客户。',
    '仅有这两个国家/地区产生了付款客户。新加坡的付款客户数比未知地区高出12.5%，占总付款客户数的52.9%。未知地区的付款客户占比为47.1%。',
  ];

  const CHART_DATA = [
    { label: '新加坡', value: 9 },
    { label: '未知地区', value: 8 },
  ];

  const DELAY_AFTER_SUBMIT = 600;
  const DELAY_BEFORE_THINKING = 400;
  const DELAY_NODE_STEP = 2000;
  const DELAY_AFTER_LAST_NODE = 800;
  const DELAY_BEFORE_ANSWER = 400;

  const messagesEl = document.getElementById('messages');
  const questionInput = document.getElementById('questionInput');
  const submitBtn = document.getElementById('submitBtn');

  function createElement(tag, className, content) {
    const el = document.createElement(tag);
    if (className) el.className = className;
    if (content !== undefined) {
      if (typeof content === 'string') el.textContent = content;
      else if (Array.isArray(content)) content.forEach((c) => el.appendChild(c));
      else el.appendChild(content);
    }
    return el;
  }

  function appendUserMessage(text) {
    const wrap = createElement('div', 'msg msg-user');
    const bubble = createElement('div', 'msg-bubble', text);
    wrap.appendChild(bubble);
    messagesEl.appendChild(wrap);
    scrollToBottom();
  }

  function scrollToBottom() {
    messagesEl.scrollTop = messagesEl.scrollHeight;
  }

  function createThinkingHeader(isThinking) {
    const header = createElement('div', 'thinking-header');
    const spinner = createElement('div', 'thinking-spinner');
    const label = createElement('span', 'thinking-label', isThinking ? '思考中...' : '思考过程');
    const labelWrap = createElement('div', 'thinking-label-wrap');
    labelWrap.appendChild(label);
    header.appendChild(spinner);
    header.appendChild(labelWrap);
    return { header, spinner, label, labelWrap };
  }

  function createToggleButton() {
    const btn = createElement('button', 'toggle-thinking');
    btn.type = 'button';
    btn.innerHTML = '<span class="icon icon-chevron"><svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><path d="M3 4.5L6 7.5L9 4.5"/></svg></span>';
    btn.title = '收起思考过程';
    btn.setAttribute('aria-label', '收起思考过程');
    return btn;
  }

  function createThinkingBody() {
    return createElement('div', 'thinking-body');
  }

  function createThinkingNode(nodeData, index) {
    const nodeEl = createElement('div', 'thinking-node');
    nodeEl.dataset.index = String(index);
    const iconWrap = createElement('div', 'thinking-node-icon');
    const nodeSpinner = createElement('div', 'thinking-node-spinner');
    const nodeCheck = createElement('div', 'thinking-node-check');
    nodeCheck.innerHTML = '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 7l3 3 7-7"/></svg>';
    nodeCheck.style.display = 'none';
    iconWrap.appendChild(nodeSpinner);
    iconWrap.appendChild(nodeCheck);
    const titleEl = createElement('div', 'thinking-node-title', nodeData.title);
    const summaryEl = createElement('div', 'thinking-node-summary', nodeData.summary);
    summaryEl.style.display = 'none';
    const titleRow = createElement('div', 'thinking-node-title-row');
    titleRow.appendChild(iconWrap);
    titleRow.appendChild(titleEl);
    nodeEl.appendChild(titleRow);
    nodeEl.appendChild(summaryEl);
    return { nodeEl, nodeSpinner, nodeCheck, summaryEl };
  }

  function createAnswerBody() {
    const wrap = createElement('div', 'answer-body');
    ANSWER_PARAGRAPHS.forEach((p) => wrap.appendChild(createElement('p', '', p)));
    return wrap;
  }

  function createChart() {
    const maxVal = Math.max(...CHART_DATA.map((d) => d.value));
    const wrap = createElement('div', 'chart-wrap');
    wrap.appendChild(createElement('div', 'chart-title', '不同国家/地区 支付顾客数'));
    const bars = createElement('div', 'chart-bars');
    CHART_DATA.forEach((d) => {
      const row = createElement('div', 'chart-row');
      row.appendChild(createElement('span', 'chart-label', d.label));
      const barWrap = createElement('div', 'chart-bar-wrap');
      const bar = createElement('div', 'chart-bar');
      bar.style.width = maxVal ? (d.value / maxVal) * 100 + '%' : '0%';
      barWrap.appendChild(bar);
      row.appendChild(barWrap);
      row.appendChild(createElement('span', 'chart-value', String(d.value)));
      bars.appendChild(row);
    });
    wrap.appendChild(bars);
    return wrap;
  }

  function runDemo() {
    const text = (questionInput.value || '').trim() || QUESTION_PLACEHOLDER;
    questionInput.value = '';
    submitBtn.disabled = true;

    appendUserMessage(text);

    const agentWrap = createElement('div', 'msg msg-agent');
    const bubble = createElement('div', 'msg-bubble');

    const { header, spinner, label, labelWrap } = createThinkingHeader(true);
    const thinkingBody = createThinkingBody();
    const toggleBtn = createToggleButton();
    labelWrap.appendChild(toggleBtn);

    function toggleThinking() {
      const collapsed = thinkingBody.classList.toggle('collapsed');
      header.classList.toggle('collapsed', collapsed);
      toggleBtn.classList.toggle('collapsed', collapsed);
      toggleBtn.title = collapsed ? '展开思考过程' : '收起思考过程';
      toggleBtn.setAttribute('aria-label', collapsed ? '展开思考过程' : '收起思考过程');
    }
    labelWrap.style.cursor = 'pointer';
    labelWrap.title = '点击展开/收起思考过程';
    labelWrap.setAttribute('role', 'button');
    labelWrap.setAttribute('aria-label', '展开或收起思考过程');
    labelWrap.addEventListener('click', toggleThinking);

    toggleBtn.style.display = 'none';

    bubble.appendChild(header);
    bubble.appendChild(thinkingBody);
    agentWrap.appendChild(bubble);
    messagesEl.appendChild(agentWrap);
    scrollToBottom();

    function showNode(index) {
      if (index >= THINKING_NODES.length) {
        setTimeout(finishThinking, DELAY_AFTER_LAST_NODE);
        return;
      }
      const nodeData = THINKING_NODES[index];
      const { nodeEl, nodeSpinner, nodeCheck, summaryEl } = createThinkingNode(nodeData, index);
      nodeEl.classList.add('active');
      thinkingBody.appendChild(nodeEl);
      scrollToBottom();

      setTimeout(() => {
        nodeEl.classList.remove('active');
        nodeEl.classList.add('done');
        nodeSpinner.style.display = 'none';
        nodeCheck.style.display = 'inline-flex';
        summaryEl.style.display = 'block';
        scrollToBottom();
        setTimeout(() => showNode(index + 1), 0);
      }, DELAY_NODE_STEP);
    }

    function finishThinking() {
      header.classList.add('completed');
      spinner.style.display = 'none';
      label.textContent = '思考过程';
      toggleBtn.style.display = 'inline-flex';
      toggleBtn.title = '展开思考过程';
      toggleBtn.setAttribute('aria-label', '展开思考过程');
      toggleBtn.classList.add('collapsed');

      setTimeout(() => {
        bubble.appendChild(createAnswerBody());
        bubble.appendChild(createChart());
        thinkingBody.classList.add('collapsed');
        header.classList.add('collapsed');
        scrollToBottom();
        submitBtn.disabled = false;
      }, DELAY_BEFORE_ANSWER);
    }

    setTimeout(() => {
      toggleBtn.style.display = 'inline-flex';
      showNode(0);
    }, DELAY_BEFORE_THINKING);
  }

  submitBtn.addEventListener('click', () => runDemo());
  questionInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runDemo();
    }
  });
})();
