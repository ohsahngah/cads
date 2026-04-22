const STORAGE_KEY_TRADES = 'osca_trades';
const STORAGE_KEY_SETTINGS = 'osca_settings';
const STORAGE_KEY_NEWS = 'osca_news';
const DEFAULT_TICKER_API_URL = 'https://api.upbit.com/v1/ticker?markets=KRW-IOTA';

const mainTabs = document.querySelectorAll('.main-tabs li');
const pages = document.querySelectorAll('.tab');
const subMenus = document.querySelectorAll('.sub-actions');

const modalRoot = document.getElementById('modalRoot');
const modalPanels = document.querySelectorAll('.modal-panel');
const modalOpenTriggers = document.querySelectorAll('[data-open-modal]');
const modalCloseTriggers = document.querySelectorAll('[data-modal-close]');

const historyTableBody = document.getElementById('historyTableBody');
const pageInfo = document.getElementById('historyPageInfo');
const pageNumbers = document.getElementById('pageNumbers');
const firstPageButton = document.getElementById('firstPageButton');
const prevPageButton = document.getElementById('prevPageButton');
const nextPageButton = document.getElementById('nextPageButton');
const lastPageButton = document.getElementById('lastPageButton');
const sortButtons = document.querySelectorAll('.sort-button');
const pageSizeSelect = document.getElementById('pageSizeSelect');

function getDefaultNewsItems() {
    return [
        {
            id: Date.now() + 1,
            title: 'IOTA Explorer',
            description: 'Search by coin, NFT, package, object or transaction',
            thumbnail: 'images/iota_explorer.png',
            source: 'IOTA Foundation',
            link: 'https://explorer.iota.org'
        },
        {
            id: Date.now() + 2,
            title: 'IOTASCAN',
            description: 'View validator performances and compare commission rates',
            thumbnail: 'images/iota_scan.png',
            source: 'IOTA Foundation',
            link: 'https://iotascan.com/mainnet/home'
        },
        {
            id: Date.now() + 3,
            title: 'IOTA Wallet',
            description: 'Your secure gateway to the IOTA ecosystem',
            thumbnail: 'images/iota_wallet.jpg',
            source: 'IOTA Foundation',
            link: 'https://chromewebstore.google.com/detail/iota-wallet/iidjkmdceolghepehaaddojmnjnkkija'
        }
    ];
}

function normalizeNewsItem(item) {
    return {
        id: Number(item?.id || Date.now()),
        title: String(item?.title || '').trim(),
        description: String(item?.description || '').trim(),
        thumbnail: String(item?.thumbnail || '').trim(),
        source: String(item?.source || '').trim(),
        link: String(item?.link || '').trim()
    };
}

function loadNewsItems() {
    const raw = localStorage.getItem(STORAGE_KEY_NEWS);

    if (!raw) {
        const defaults = getDefaultNewsItems().map(normalizeNewsItem);
        localStorage.setItem(STORAGE_KEY_NEWS, JSON.stringify(defaults));
        return defaults;
    }

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(normalizeNewsItem) : [];
    } catch (err) {
        return [];
    }
}

function saveNewsItems(items) {
    localStorage.setItem(
        STORAGE_KEY_NEWS,
        JSON.stringify(items.map(normalizeNewsItem))
    );
}

function renderNews() {
    const newsList = byId('newsList');
    if (!newsList) return;

    const newsItems = loadNewsItems();

    if (!newsItems.length) {
        newsList.innerHTML = `
            <div class="news-empty">표시할 뉴스가 없습니다.</div>
        `;
        return;
    }

    newsList.innerHTML = newsItems.map(item => `
        <div class="news-card" data-news-id="${item.id}">
            <a class="news-card-link" href="${item.link}" target="_blank" rel="noopener noreferrer">
                <div class="news-thumb-wrap">
                    <img class="news-thumb" src="${item.thumbnail}" alt="${item.title}">
                </div>
                <div class="news-content">
                    <div class="news-title">${item.title}</div>
                    <div class="news-desc">${item.description}</div>
                    <div class="news-meta">
                        <span class="news-source">${item.source}</span>
                    </div>
                </div>
            </a>

            <div class="news-card-actions">
                <button type="button" class="news-edit-btn" data-news-edit-id="${item.id}" aria-label="뉴스 수정">
                    <svg viewBox="0 0 24 24" fill="none">
                        <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                        <path d="M13 7l4 4" />
                    </svg>
                </button>
            </div>
        </div>
    `).join('');
}

function addNewsItem() {
    const title = String(byId('newsTitleInput')?.value || '').trim();
    const description = String(byId('newsDescInput')?.value || '').trim();
    const thumbnail = String(byId('newsThumbnailInput')?.value || '').trim();
    const source = String(byId('newsSourceInput')?.value || '').trim();
    const link = String(byId('newsLinkInput')?.value || '').trim();

    if (!title) {
        alert('뉴스 타이틀을 입력해 주세요.');
        return;
    }

    if (!description) {
        alert('뉴스 설명을 입력해 주세요.');
        return;
    }

    if (!source) {
        alert('출처를 입력해 주세요.');
        return;
    }

    if (!link) {
        alert('링크 주소를 입력해 주세요.');
        return;
    }

    const newsItems = loadNewsItems();

    newsItems.unshift({
        id: Date.now(),
        title,
        description,
        thumbnail: thumbnail || 'https://via.placeholder.com/320x180',
        source,
        link
    });

    saveNewsItems(newsItems);
    renderNews();
    closeModal();

    clearInputs([
        'newsTitleInput',
        'newsDescInput',
        'newsThumbnailInput',
        'newsSourceInput',
        'newsLinkInput'
    ]);
}

function clearNewsInputs() {
    clearInputs([
        'newsTitleInput',
        'newsDescInput',
        'newsThumbnailInput',
        'newsSourceInput',
        'newsLinkInput'
    ]);
}

function getNewsFormValues() {
    return {
        title: String(byId('newsTitleInput')?.value || '').trim(),
        description: String(byId('newsDescInput')?.value || '').trim(),
        thumbnail: String(byId('newsThumbnailInput')?.value || '').trim(),
        source: String(byId('newsSourceInput')?.value || '').trim(),
        link: String(byId('newsLinkInput')?.value || '').trim()
    };
}

function validateNewsForm({ title, description, source, link }) {
    if (!title) {
        alert('뉴스 타이틀을 입력해 주세요.');
        return false;
    }

    if (!description) {
        alert('뉴스 설명을 입력해 주세요.');
        return false;
    }

    if (!source) {
        alert('출처를 입력해 주세요.');
        return false;
    }

    if (!link) {
        alert('링크 주소를 입력해 주세요.');
        return false;
    }

    return true;
}

function resetNewsModalMode() {
    state.editingNewsId = null;

    const modalTitle = byId('modalAddNewsTitle');
    const modalSubtitle = byId('modalAddNewsSubtitle');
    const saveButton = byId('saveAddNewsBtn');
    const deleteButton = byId('deleteNewsBtn');

    if (modalTitle) modalTitle.textContent = '참고자료 추가';
    if (modalSubtitle) modalSubtitle.textContent = '자주 사용되는 유용한 웹 페이지를 등록하세요';
    if (saveButton) saveButton.textContent = '추가';
    if (deleteButton) deleteButton.style.display = 'none';
}

function openAddNewsModal() {
    resetNewsModalMode();
    clearNewsInputs();
    openModal('add-news');
}

function openEditNewsModal(newsId) {
    const newsItems = loadNewsItems();
    const targetItem = newsItems.find(item => Number(item.id) === Number(newsId));

    if (!targetItem) return;

    state.editingNewsId = Number(newsId);

    const modalTitle = byId('modalAddNewsTitle');
    const modalSubtitle = byId('modalAddNewsSubtitle');
    const saveButton = byId('saveAddNewsBtn');
    const deleteButton = byId('deleteNewsBtn');

    if (modalTitle) modalTitle.textContent = '참고자료 수정';
    if (modalSubtitle) modalSubtitle.textContent = '기존 참고자료 정보를 수정할 수 있습니다';
    if (saveButton) saveButton.textContent = '수정';
    if (deleteButton) deleteButton.style.display = 'inline-flex';

    if (byId('newsTitleInput')) byId('newsTitleInput').value = targetItem.title || '';
    if (byId('newsDescInput')) byId('newsDescInput').value = targetItem.description || '';
    if (byId('newsThumbnailInput')) byId('newsThumbnailInput').value = targetItem.thumbnail || '';
    if (byId('newsSourceInput')) byId('newsSourceInput').value = targetItem.source || '';
    if (byId('newsLinkInput')) byId('newsLinkInput').value = targetItem.link || '';

    openModal('add-news');
}

function updateNewsItem(newsId) {
    const form = getNewsFormValues();

    if (!validateNewsForm(form)) return;

    const newsItems = loadNewsItems();

    const nextItems = newsItems.map(item => {
        if (Number(item.id) !== Number(newsId)) return item;

        return {
            ...item,
            title: form.title,
            description: form.description,
            thumbnail: form.thumbnail || 'https://via.placeholder.com/320x180',
            source: form.source,
            link: form.link
        };
    });

    saveNewsItems(nextItems);
    renderNews();
    closeModal();
}

function submitNewsItem() {
    if (state.editingNewsId != null) {
        updateNewsItem(state.editingNewsId);
        return;
    }

    addNewsItem();
}

function removeNewsItem(newsId) {
    const newsItems = loadNewsItems();
    const nextItems = newsItems.filter(item => Number(item.id) !== Number(newsId));
    saveNewsItems(nextItems);
    renderNews();
}

const state = {
    page: 1,
    pageSize: 10,
    sortKey: 'date',
    sortDirection: 'desc',
    isRefreshingPrice: false,
    lastPriceRefreshAt: 0,
    autoRefreshTimer: null,
    settings: null,
    confirmAction: null,
    editingNewsId: null,
    editingTradeId: null
};

function showPageLoading() {
    const loading = byId('pageLoading');
    if (!loading) return;

    loading.classList.add('active');
    loading.setAttribute('aria-hidden', 'false');
}

function hidePageLoading() {
    const loading = byId('pageLoading');
    if (!loading) return;

    loading.classList.remove('active');
    loading.setAttribute('aria-hidden', 'true');
}

function byId(id) {
    return document.getElementById(id);
}

function getTodayDateString() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
}

function getNowDateTimeText() {
    const now = new Date();
    const y = now.getFullYear();
    const m = String(now.getMonth() + 1).padStart(2, '0');
    const d = String(now.getDate()).padStart(2, '0');
    const h = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');
    const s = String(now.getSeconds()).padStart(2, '0');
    return `${y}-${m}-${d} ${h}:${min}:${s}`;
}

function round2(value) {
    const num = Number(value || 0);
    return Math.round((num + Number.EPSILON) * 100) / 100;
}

function format2(value) {
    return round2(value).toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    });
}

// function formatNumber(value) {
//     return Number(value || 0).toLocaleString('ko-KR');
// }

function formatPrice(value) {
    return `₩${Number(value || 0).toLocaleString('ko-KR', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
    })}`;
}

function parseFormattedNumber(value) {
    const cleaned = String(value || '').replace(/,/g, '').trim();
    if (!cleaned) return 0;
    return round2(cleaned);
}

function formatGeneralNumberInput(value) {
    let str = String(value || '').replace(/,/g, '').replace(/[^\d.]/g, '');
    const firstDotIndex = str.indexOf('.');

    if (firstDotIndex !== -1) {
        const integerPart = str.slice(0, firstDotIndex);
        let decimalPart = str.slice(firstDotIndex + 1).replace(/\./g, '');
        decimalPart = decimalPart.slice(0, 2);
        const formattedInteger = integerPart ? Number(integerPart).toLocaleString('ko-KR') : '0';
        return decimalPart.length > 0 ? `${formattedInteger}.${decimalPart}` : `${formattedInteger}.`;
    }

    if (!str) return '';
    return Number(str).toLocaleString('ko-KR');
}

function getRecommendation(profitRate, riskMode) {
    const rate = Number(profitRate || 0);

    if (rate <= -40) return { text: '강매수', className: 'positive' };
    if (rate <= -20) return { text: '매수', className: 'positive' };
    if (rate < 20) {
        return riskMode
            ? { text: '관망', className: '' }
            : { text: '매집', className: '' };
    }
    if (rate < 40) return { text: '매도', className: 'negative' };
    return { text: '강매도', className: 'negative' };
}

function getDefaultSettings() {
    return {
        rewardQty: 0,
        burnQty: 0,
        baseBurnQty: 0.10,
        rewardRate: 11,
        targetQty: 40000,
        currentPrice: 100,
        feeRate: 0.10,
        taxRate: 22,
        taxDeduction: 2500000,
        withdrawFee: 1000,
        riskMode: false,
        tickerApiUrl: DEFAULT_TICKER_API_URL,
        apiKey: '',
        priceFieldKey: 'trade_price',
        apiStatusMessage: '아직 현재가를 갱신하지 않았습니다.',
        autoRefreshPrice: false
    };
}

function normalizeTrade(trade) {
    return {
        id: Number(trade.id || Date.now()),
        createdAt: Number(trade.createdAt || Date.now()),
        date: String(trade.date || getTodayDateString()),
        quantity: round2(trade.quantity),
        price: round2(trade.price),
        memo: String(trade.memo || '').trim()
    };
}

function loadTrades() {
    const raw = localStorage.getItem(STORAGE_KEY_TRADES);
    if (!raw) return [];

    try {
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed.map(normalizeTrade) : [];
    } catch (err) {
        return [];
    }
}

function saveTrades(trades) {
    localStorage.setItem(STORAGE_KEY_TRADES, JSON.stringify(trades.map(normalizeTrade)));
}

function normalizeSettings(settings) {
    const defaults = getDefaultSettings();
    const source = settings && typeof settings === 'object' ? settings : {};

    return {
        rewardQty: round2(source.rewardQty),
        burnQty: round2(source.burnQty != null ? source.burnQty : defaults.burnQty),
        baseBurnQty: round2(source.baseBurnQty != null ? source.baseBurnQty : defaults.baseBurnQty),
        rewardRate: round2(source.rewardRate != null ? source.rewardRate : defaults.rewardRate),
        targetQty: round2(source.targetQty),
        currentPrice: round2(source.currentPrice),
        feeRate: round2(source.feeRate != null ? source.feeRate : defaults.feeRate),
        taxRate: round2(source.taxRate != null ? source.taxRate : defaults.taxRate),
        taxDeduction: round2(source.taxDeduction != null ? source.taxDeduction : defaults.taxDeduction),
        withdrawFee: round2(source.withdrawFee != null ? source.withdrawFee : defaults.withdrawFee),
        riskMode: Boolean(source.riskMode),
        tickerApiUrl: String(source.tickerApiUrl || defaults.tickerApiUrl),
        apiKey: String(source.apiKey || ''),
        priceFieldKey: String(source.priceFieldKey || defaults.priceFieldKey),
        apiStatusMessage: String(source.apiStatusMessage || defaults.apiStatusMessage),
        autoRefreshPrice: Boolean(source.autoRefreshPrice)
    };
}

function loadSettings() {
    if (state.settings) return { ...state.settings };

    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (!raw) {
        state.settings = normalizeSettings(getDefaultSettings());
        return { ...state.settings };
    }

    try {
        state.settings = normalizeSettings(JSON.parse(raw));
    } catch (err) {
        state.settings = normalizeSettings(getDefaultSettings());
    }

    return { ...state.settings };
}

function saveSettings(settings) {
    state.settings = normalizeSettings(settings);
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(state.settings));
}

function setApiStatus(message) {
    const settings = loadSettings();
    saveSettings({
        ...settings,
        apiStatusMessage: message
    });
    renderApiStatus();
}

function renderApiStatus() {
    const settings = loadSettings();
    const apiStatusText = byId('apiStatusText');
    if (apiStatusText) {
        apiStatusText.textContent = settings.apiStatusMessage;
    }
}

function getEarliestTradeDate(trades) {
    if (!trades.length) return null;
    const dates = trades.map(trade => trade.date).filter(Boolean).sort();
    return dates.length ? dates[0] : null;
}

function calculateInvestDays(startDateString) {
    if (!startDateString) return 0;

    const start = new Date(`${startDateString}T00:00:00`);
    const today = new Date();
    const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const diffMs = current.getTime() - start.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    return diffDays >= 0 ? diffDays + 1 : 0;
}

function calculateSummary(trades, settings) {
    let totalQty = 0;
    let totalCost = 0;

    trades.forEach(trade => {
        const qty = round2(trade.quantity);
        const price = round2(trade.price);
        totalQty += qty;
        totalCost += qty * price;
    });

    totalQty = round2(totalQty);
    totalCost = round2(totalCost);

    const rewardQty = round2(settings.rewardQty);
    const burnQty = round2(settings.burnQty != null ? settings.burnQty : 0);
    const baseBurnQty = round2(settings.baseBurnQty != null ? settings.baseBurnQty : 0.10);

    const simpleBaseQty = round2(Math.max(0, totalQty - burnQty));
    const actualQty = round2(Math.max(0, totalQty + rewardQty - burnQty));
    const avgPrice = actualQty > 0 ? round2(totalCost / actualQty) : 0;

    const rewardRate = round2(settings.rewardRate != null ? settings.rewardRate : 0);
    const dailyRewardSimple = round2(simpleBaseQty * (rewardRate / 100) / 365);
    const dailyRewardCompound = round2(actualQty * (rewardRate / 100) / 365);

    const targetQty = round2(settings.targetQty);
    const progressRate = targetQty > 0 ? round2((actualQty / targetQty) * 100) : 0;
    const remainQty = targetQty > 0 ? round2(Math.max(0, targetQty - actualQty)) : 0;

    const currentPrice = round2(settings.currentPrice);
    const requiredAmount = round2(remainQty * currentPrice);

    const feeRate = round2(settings.feeRate != null ? settings.feeRate : 0.10);
    const requiredAmountFee = round2(requiredAmount * (feeRate / 100));
    const requiredAmountWithFee = round2(requiredAmount + requiredAmountFee);

    const grossValue = round2(actualQty * currentPrice);
    const estimatedFee = round2(grossValue * (feeRate / 100));

    const withdrawFee = round2(settings.withdrawFee != null ? settings.withdrawFee : 1000);
    const netValue = round2(grossValue - estimatedFee - withdrawFee);

    const taxRate = round2(settings.taxRate != null ? settings.taxRate : 22);
    const taxDeduction = round2(settings.taxDeduction != null ? settings.taxDeduction : 2500000);
    const rawTaxBase = round2(netValue - taxDeduction);
    const taxBase = rawTaxBase > 0 ? rawTaxBase : 0;
    const taxAmount = taxBase > 0 ? round2(taxBase * (taxRate / 100)) : 0;
    const actualProfit = round2(netValue - taxAmount);

    const profitAmount = round2(netValue - totalCost);
    const profitRate = totalCost > 0 ? round2((profitAmount / totalCost) * 100) : 0;
    const recommendation = getRecommendation(profitRate, settings.riskMode);

    const startDate = getEarliestTradeDate(trades);
    const investDays = calculateInvestDays(startDate);

    return {
        startDate,
        investDays,
        totalQty,
        totalCost,
        rewardQty,
        burnQty,
        baseBurnQty,
        actualQty,
        avgPrice,
        rewardRate,
        dailyRewardSimple,
        dailyRewardCompound,
        targetQty,
        progressRate,
        remainQty,
        currentPrice,
        requiredAmount,
        requiredAmountFee,
        requiredAmountWithFee,
        grossValue,
        feeRate,
        estimatedFee,
        withdrawFee,
        netValue,
        taxRate,
        taxDeduction,
        taxBase,
        taxAmount,
        actualProfit,
        profitAmount,
        profitRate,
        recommendation
    };
}

function setProfitClass(element, value) {
    if (!element) return;
    element.classList.remove('positive', 'negative');

    if (value > 0) element.classList.add('positive');
    if (value < 0) element.classList.add('negative');
}

function shouldShowDashboardEmpty() {
    const trades = loadTrades();
    const rawSettings = localStorage.getItem(STORAGE_KEY_SETTINGS);

    return trades.length === 0 && !rawSettings;
}

function renderSummary() {
    const dashboardEmpty = byId('dashboardEmpty');
    const summaryCards = byId('summaryCards');
    const actionTextEl = byId('actionText');

    if (shouldShowDashboardEmpty()) {
        if (dashboardEmpty) dashboardEmpty.classList.add('active');
        if (summaryCards) summaryCards.style.display = 'none';

        if (actionTextEl) {
            actionTextEl.textContent = '설정 필요';
            actionTextEl.classList.remove('positive', 'negative', 'warning');
        }

        renderApiStatus();
        return;
    }

    if (dashboardEmpty) dashboardEmpty.classList.remove('active');
    if (summaryCards) summaryCards.style.display = '';

    const trades = loadTrades();
    const settings = loadSettings();
    const summary = calculateSummary(trades, settings);

    if (byId('startDate')) byId('startDate').textContent = summary.startDate || '-';
    if (byId('investDays')) byId('investDays').textContent = summary.investDays;
    if (byId('totalQty')) byId('totalQty').textContent = format2(summary.totalQty);
    if (byId('totalCost')) byId('totalCost').textContent = format2(summary.totalCost);
    if (byId('rewardQty')) byId('rewardQty').textContent = format2(summary.rewardQty);
    if (byId('burnQty')) byId('burnQty').textContent = format2(summary.burnQty);
    if (byId('burnQtySub')) byId('burnQtySub').textContent = `기본 전송소각 수량: ${format2(summary.baseBurnQty)}(개)`;
    if (byId('actualQty')) byId('actualQty').textContent = format2(summary.actualQty);
    if (byId('avgPrice')) byId('avgPrice').textContent = format2(summary.avgPrice);
    if (byId('progressRate')) byId('progressRate').textContent = `${format2(summary.progressRate)}%`;
    if (byId('remainQty')) byId('remainQty').textContent = format2(summary.remainQty);
    if (byId('currentPrice')) byId('currentPrice').textContent = format2(summary.currentPrice);
    if (byId('grossValue')) byId('grossValue').textContent = format2(summary.grossValue);
    if (byId('estimatedFee')) byId('estimatedFee').textContent = format2(summary.estimatedFee);
    if (byId('netValue')) byId('netValue').textContent = format2(summary.netValue);
    if (byId('taxBase')) byId('taxBase').textContent = format2(summary.taxBase);
    if (byId('taxAmount')) byId('taxAmount').textContent = format2(summary.taxAmount);
    if (byId('actualProfit')) byId('actualProfit').textContent = format2(summary.actualProfit);
    if (byId('targetQtySub')) byId('targetQtySub').textContent = `목표 수량: ${format2(summary.targetQty)}(개)`;
    if (byId('feeRateSub')) byId('feeRateSub').textContent = `매수 + 매도 수수료율: ${format2(summary.feeRate)}%`;
    if (byId('taxRateSub')) byId('taxRateSub').textContent = `세금 대상 금액 기준: 세율 ${format2(summary.taxRate)}%`;
    if (byId('taxDeductionSub')) byId('taxDeductionSub').textContent = `공제액 ${format2(summary.taxDeduction)}`;
    if (byId('withdrawFee')) byId('withdrawFee').textContent = format2(summary.withdrawFee);
    if (byId('targetQtyInRemain')) byId('targetQtyInRemain').textContent = format2(summary.targetQty);
    if (byId('requiredAmount')) byId('requiredAmount').textContent = format2(summary.requiredAmount);
    if (byId('requiredAmountWithFee')) byId('requiredAmountWithFee').textContent = format2(summary.requiredAmountWithFee);

    if (byId('requiredAmountWithFeeSub')) {
        byId('requiredAmountWithFeeSub').textContent =
            `현재 단가 × 목표까지 남은 수량 + 1회 거래 수수료(${format2(summary.feeRate)}%)`;
    }

    if (byId('dailyRewardSimple')) byId('dailyRewardSimple').textContent = format2(summary.dailyRewardSimple);
    if (byId('dailyRewardCompound')) byId('dailyRewardCompound').textContent = format2(summary.dailyRewardCompound);

    const profitAmountEl = byId('profitAmount');
    const profitRateEl = byId('profitRate');
    const rewardSimpleDesc = byId('dailyRewardSimple')?.nextElementSibling;
    const rewardCompoundDesc = byId('dailyRewardCompound')?.nextElementSibling;

    if (profitAmountEl) {
        profitAmountEl.textContent = format2(summary.profitAmount);
        setProfitClass(profitAmountEl, summary.profitAmount);
    }

    if (profitRateEl) {
        profitRateEl.textContent = `${format2(summary.profitRate)}%`;
        setProfitClass(profitRateEl, summary.profitRate);
    }

    if (actionTextEl) {
        let action = { ...summary.recommendation };

        if (summary.progressRate >= 100 && action.text === '매집') {
            action = { text: '관망', className: 'warning' };
        }

        actionTextEl.textContent = action.text;
        actionTextEl.classList.remove('positive', 'negative', 'warning');

        if (action.text === '매집') {
            actionTextEl.classList.add('positive');
        } else if (action.text === '관망') {
            actionTextEl.classList.add('warning');
        } else if (action.className) {
            actionTextEl.classList.add(action.className);
        }
    }

    if (rewardSimpleDesc) {
        rewardSimpleDesc.textContent = `직접 매수 수량 - 전송소각 기준 · 연 ${format2(summary.rewardRate)}%`;
    }

    if (rewardCompoundDesc) {
        rewardCompoundDesc.textContent = `실제 보유 수량 기준 · 연 ${format2(summary.rewardRate)}%`;
    }
}


function sortTrades(data) {
    const sorted = [...data].sort((a, b) => {
        const { sortKey, sortDirection } = state;
        let compare = 0;

        if (sortKey === 'date') {
            compare = new Date(a.date).getTime() - new Date(b.date).getTime();
        } else if (sortKey === 'total') {
            compare = round2(a.quantity * a.price) - round2(b.quantity * b.price);
        } else {
            compare = Number(a[sortKey] || 0) - Number(b[sortKey] || 0);
        }

        return sortDirection === 'asc' ? compare : -compare;
    });

    return sorted;
}

function renderSortState() {
    sortButtons.forEach(button => {
        button.classList.remove('active', 'asc', 'desc');
        if (button.dataset.sort === state.sortKey) {
            button.classList.add('active', state.sortDirection);
        }
    });
}

function renderPageNumbers(totalPages) {
    if (!pageNumbers) return;
    pageNumbers.innerHTML = '';

    const maxVisible = 5;
    let start = Math.max(1, state.page - Math.floor(maxVisible / 2));
    let end = start + maxVisible - 1;

    if (end > totalPages) {
        end = totalPages;
        start = Math.max(1, end - maxVisible + 1);
    }

    for (let i = start; i <= end; i++) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `page-number${i === state.page ? ' active' : ''}`;
        button.textContent = String(i);

        button.addEventListener('click', () => {
            state.page = i;
            renderHistoryTable();
        });

        pageNumbers.appendChild(button);
    }
}

function renderHistoryTable() {
    if (!historyTableBody) return;

    const trades = loadTrades();
    const sortedData = sortTrades(trades);
    const totalPages = Math.max(1, Math.ceil(sortedData.length / state.pageSize));
    const safePage = Math.min(state.page, totalPages);
    state.page = safePage;

    const startIndex = (safePage - 1) * state.pageSize;
    const pagedData = sortedData.slice(startIndex, startIndex + state.pageSize);

    if (pagedData.length === 0) {
        historyTableBody.innerHTML = `
            <tr class="empty-row">
                <td colspan="6">등록된 내역이 없습니다.</td>
            </tr>
        `;
    } else {
        historyTableBody.innerHTML = pagedData.map(item => {
            const total = round2(item.quantity * item.price);

            return `
                <tr data-id="${item.id}">
                    <td class="cell-date">${item.date}</td>
                    <td class="cell-qty">${format2(item.quantity)}</td>
                    <td class="cell-price">${formatPrice(item.price)}</td>
                    <td class="cell-total">₩${format2(total)}</td>
                    <td class="cell-memo" title="${item.memo || ''}">${item.memo || ''}</td>
                    <td>
                        <button type="button" class="edit-button" data-edit-id="${item.id}" aria-label="수정">
                            <svg viewBox="0 0 24 24" fill="none">
                                <path d="M4 20h4l10-10-4-4L4 16v4Z" />
                                <path d="M13 7l4 4" />
                            </svg>
                        </button>
                    </td>
                </tr>
            `;
        }).join('');
    }

    if (pageInfo) {
        pageInfo.textContent = `${safePage} / ${totalPages} (총 ${sortedData.length}건)`;
    }

    if (firstPageButton) firstPageButton.disabled = safePage === 1;
    if (prevPageButton) prevPageButton.disabled = safePage === 1;
    if (nextPageButton) nextPageButton.disabled = safePage === totalPages;
    if (lastPageButton) lastPageButton.disabled = safePage === totalPages;

    renderPageNumbers(totalPages);
    renderSortState();
}

function render() {
    renderSummary();
    renderHistoryTable();
    renderApiStatus();
    renderNews();
}

function resetBuyRecordModalMode() {
    state.editingTradeId = null;

    const titleEl = byId('buyRecordModalTitle');
    const subtitleEl = byId('buyRecordModalSubtitle');
    const saveBtn = byId('addBtn');
    const deleteBtn = byId('deleteTradeBtn');

    if (titleEl) titleEl.textContent = '암호화폐 추가';
    if (subtitleEl) subtitleEl.textContent = '매수 기록을 등록하세요';
    if (saveBtn) saveBtn.textContent = '추가';
    if (deleteBtn) deleteBtn.style.display = 'none';
}

function fillTradeInputs(trade) {
    if (!trade) return;

    if (byId('date')) byId('date').value = trade.date || '';
    if (byId('quantity')) byId('quantity').value = formatGeneralNumberInput(trade.quantity || 0);
    if (byId('price')) byId('price').value = formatGeneralNumberInput(trade.price || 0);
    if (byId('memo')) byId('memo').value = trade.memo || '';

    updateBuyAmountPreview();
}

function openAddTradeModal() {
    resetBuyRecordModalMode();

    clearInputs(['date', 'quantity', 'price', 'memo']);
    if (byId('date')) byId('date').value = getTodayDateString();

    updateBuyAmountPreview();
    openModal('buy-record');
}

function openEditTradeModal(tradeId) {
    const trades = loadTrades();
    const targetTrade = trades.find(item => Number(item.id) === Number(tradeId));
    if (!targetTrade) return;

    state.editingTradeId = Number(tradeId);

    const titleEl = byId('buyRecordModalTitle');
    const subtitleEl = byId('buyRecordModalSubtitle');
    const saveBtn = byId('addBtn');
    const deleteBtn = byId('deleteTradeBtn');

    if (titleEl) titleEl.textContent = '암호화폐 수정';
    if (subtitleEl) subtitleEl.textContent = '매수 기록을 수정할 수 있습니다';
    if (saveBtn) saveBtn.textContent = '수정';
    if (deleteBtn) deleteBtn.style.display = 'inline-flex';

    fillTradeInputs(targetTrade);
    openModal('buy-record');
}

function updateTrade() {
    if (state.editingTradeId == null) return;

    const date = String(byId('date')?.value || '').trim();
    const quantity = parseFormattedNumber(byId('quantity')?.value);
    const price = parseFormattedNumber(byId('price')?.value);
    const memo = String(byId('memo')?.value || '').trim();

    if (!date) {
        alert('날짜를 입력해 주세요.');
        return;
    }

    if (quantity <= 0) {
        alert('수량을 입력해 주세요.');
        return;
    }

    if (price <= 0) {
        alert('단가를 입력해 주세요.');
        return;
    }

    const trades = loadTrades();
    const nextTrades = trades.map(item => {
        if (Number(item.id) !== Number(state.editingTradeId)) return item;

        return {
            ...item,
            date,
            quantity,
            price,
            memo
        };
    });

    saveTrades(nextTrades);
    closeModal();
    render();
}

function submitTrade() {
    if (state.editingTradeId != null) {
        updateTrade();
        return;
    }

    addTrade();
}

async function switchTab(tabName) {
    const currentTab = document.querySelector('.main-tabs li.active')?.dataset.tab;
    if (currentTab === tabName) return;

    showPageLoading();

    await new Promise(resolve => setTimeout(resolve, 180));

    mainTabs.forEach(tab => {
        tab.classList.toggle('active', tab.dataset.tab === tabName);
    });

    pages.forEach(page => {
        page.classList.toggle('active', page.id === tabName);
    });

    subMenus.forEach(menu => {
        menu.classList.toggle('active', menu.dataset.submenu === tabName);
    });

    if (location.hash !== `#${tabName}`) {
        history.replaceState(null, '', `#${tabName}`);
    }

    hidePageLoading();
}

function openModal(modalName) {
    if (!modalRoot) return;

    modalRoot.classList.add('active');
    modalRoot.setAttribute('aria-hidden', 'false');
    document.body.classList.add('modal-open');

    modalPanels.forEach(panel => {
        panel.classList.toggle('active', panel.dataset.modal === modalName);
    });
}

function clearInputs(ids = []) {
    ids.forEach(id => {
        const el = byId(id);
        if (el) el.value = '';
    });
}

function closeModal() {
    if (!modalRoot) return;

    const activePanel = document.querySelector('.modal-panel.active');

    modalRoot.classList.remove('active');
    modalRoot.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('modal-open');

    modalPanels.forEach(panel => {
        panel.classList.remove('active');
    });

    if (activePanel?.dataset.modal === 'buy-record') {
        clearInputs(['date', 'quantity', 'price', 'buyAmountDisplay', 'memo']);
        resetBuyRecordModalMode();
    }

    if (activePanel?.dataset.modal === 'add-reward') {
        clearInputs(['currentRewardQtyDisplay', 'addRewardQtyInput']);
    }

    if (activePanel?.dataset.modal === 'add-burn') {
        clearInputs(['currentActualQtyDisplay', 'addBurnQtyInput']);
    }

    if (activePanel?.dataset.modal === 'add-news') {
        clearNewsInputs();
        resetNewsModalMode();
    }

    state.confirmAction = null;
}

function openConfirmModal(message, onConfirm, options = {}) {
    const confirmMessage = byId('confirmMessage');
    const confirmOkBtn = byId('confirmOkBtn');

    if (confirmMessage) {
        confirmMessage.textContent = message || '정말 진행하시겠습니까?';
    }

    if (confirmOkBtn) {
        confirmOkBtn.textContent = options.confirmText || '확인';
    }

    state.confirmAction = typeof onConfirm === 'function' ? onConfirm : null;
    openModal('confirm-action');
}

function runConfirmAction() {
    const action = state.confirmAction;
    state.confirmAction = null;
    closeModal();

    if (typeof action === 'function') {
        action();
    }
}

function fillSettingsInputs() {
    const settings = loadSettings();

    if (byId('rewardQtyInput')) byId('rewardQtyInput').value = settings.rewardQty > 0 ? formatGeneralNumberInput(settings.rewardQty.toFixed(2)) : '';
    if (byId('burnQtyInput')) byId('burnQtyInput').value = settings.burnQty > 0 ? formatGeneralNumberInput(settings.burnQty.toFixed(2)) : '';
    if (byId('baseBurnQtyInput')) byId('baseBurnQtyInput').value = formatGeneralNumberInput(settings.baseBurnQty.toFixed(2));
    if (byId('targetQtyInput')) byId('targetQtyInput').value = settings.targetQty > 0 ? formatGeneralNumberInput(settings.targetQty.toFixed(2)) : '';
    if (byId('currentPriceInput')) byId('currentPriceInput').value = settings.currentPrice > 0 ? formatGeneralNumberInput(settings.currentPrice.toFixed(2)) : '';
    if (byId('feeRateInput')) byId('feeRateInput').value = formatGeneralNumberInput(settings.feeRate.toFixed(2));
    if (byId('taxRateInput')) byId('taxRateInput').value = formatGeneralNumberInput(settings.taxRate.toFixed(2));
    if (byId('taxDeductionInput')) byId('taxDeductionInput').value = formatGeneralNumberInput(settings.taxDeduction.toFixed(2));
    if (byId('withdrawFeeInput')) byId('withdrawFeeInput').value = formatGeneralNumberInput(settings.withdrawFee.toFixed(2));
    if (byId('rewardRateInput')) byId('rewardRateInput').value = formatGeneralNumberInput(settings.rewardRate.toFixed(2));
    if (byId('riskModeInput')) byId('riskModeInput').checked = Boolean(settings.riskMode);

    if (byId('price') && settings.currentPrice > 0) {
        byId('price').placeholder = `현재 단가 ${format2(settings.currentPrice)} 적용`;
    }
}

function fillApiInputs() {
    const settings = loadSettings();

    if (byId('tickerApiUrlInput')) byId('tickerApiUrlInput').value = settings.tickerApiUrl || '';
    if (byId('apiKeyInput')) byId('apiKeyInput').value = settings.apiKey || '';
    if (byId('priceFieldKeyInput')) byId('priceFieldKeyInput').value = settings.priceFieldKey || '';
    if (byId('autoRefreshPriceInput')) byId('autoRefreshPriceInput').checked = Boolean(settings.autoRefreshPrice);
}

function fillAddRewardInputs() {
    const settings = loadSettings();
    const trades = loadTrades();
    const summary = calculateSummary(trades, settings);

    if (byId('currentRewardQtyDisplay')) {
        byId('currentRewardQtyDisplay').value = formatGeneralNumberInput(summary.rewardQty.toFixed(2));
    }

    if (byId('addRewardQtyInput')) {
        byId('addRewardQtyInput').value = formatGeneralNumberInput(summary.dailyRewardSimple.toFixed(2));
    }
}

function fillAllSettingsInputs() {
    fillSettingsInputs();
    fillApiInputs();
}

function saveAllSettingsFromInputs() {
    const currentSettings = loadSettings();

    const nextSettings = {
        ...currentSettings,
        rewardQty: parseFormattedNumber(byId('rewardQtyInput')?.value),
        burnQty: parseFormattedNumber(byId('burnQtyInput')?.value),
        baseBurnQty: parseFormattedNumber(byId('baseBurnQtyInput')?.value),
        rewardRate: parseFormattedNumber(byId('rewardRateInput')?.value),
        targetQty: parseFormattedNumber(byId('targetQtyInput')?.value),
        currentPrice: parseFormattedNumber(byId('currentPriceInput')?.value),
        feeRate: parseFormattedNumber(byId('feeRateInput')?.value),
        taxRate: parseFormattedNumber(byId('taxRateInput')?.value),
        taxDeduction: parseFormattedNumber(byId('taxDeductionInput')?.value),
        withdrawFee: parseFormattedNumber(byId('withdrawFeeInput')?.value),
        riskMode: Boolean(byId('riskModeInput')?.checked),
        tickerApiUrl: String(byId('tickerApiUrlInput')?.value || '').trim(),
        apiKey: String(byId('apiKeyInput')?.value || '').trim(),
        priceFieldKey: String(byId('priceFieldKeyInput')?.value || '').trim(),
        autoRefreshPrice: Boolean(byId('autoRefreshPriceInput')?.checked)
    };

    saveSettings(nextSettings);
    render();

    if (nextSettings.autoRefreshPrice) {
        startAutoPriceRefresh();
    } else if (state.autoRefreshTimer) {
        clearInterval(state.autoRefreshTimer);
        state.autoRefreshTimer = null;
    }

    closeModal();
}

function addRewardQty() {
    const settings = loadSettings();
    const addQty = parseFormattedNumber(byId('addRewardQtyInput')?.value);

    if (addQty <= 0) {
        alert('추가할 보상 수량을 입력해 주세요.');
        return;
    }

    saveSettings({
        ...settings,
        rewardQty: round2(settings.rewardQty + addQty)
    });

    render();
    closeModal();
}

function fillAddBurnInputs() {
    const settings = loadSettings();
    const trades = loadTrades();
    const summary = calculateSummary(trades, settings);

    if (byId('currentActualQtyDisplay')) {
        byId('currentActualQtyDisplay').value = formatGeneralNumberInput(summary.actualQty.toFixed(2));
    }

    if (byId('addBurnQtyInput')) {
        byId('addBurnQtyInput').value = formatGeneralNumberInput(summary.baseBurnQty.toFixed(2));
    }
}

function addBurnQty() {
    const settings = loadSettings();
    const trades = loadTrades();
    const summary = calculateSummary(trades, settings);
    const addQty = parseFormattedNumber(byId('addBurnQtyInput')?.value);

    if (addQty <= 0) {
        alert('추가할 소각 수량을 입력해 주세요.');
        return;
    }

    if (addQty > summary.actualQty) {
        alert('소각 수량은 현재 실제 보유 수량을 초과할 수 없습니다.');
        return;
    }

    saveSettings({
        ...settings,
        burnQty: round2((settings.burnQty || 0) + addQty)
    });

    render();
    closeModal();
}

function syncSettingsDraftFromInputs() {
    const currentSettings = loadSettings();

    state.settings = normalizeSettings({
        ...currentSettings,
        rewardQty: parseFormattedNumber(byId('rewardQtyInput')?.value),
        burnQty: parseFormattedNumber(byId('burnQtyInput')?.value),
        baseBurnQty: parseFormattedNumber(byId('baseBurnQtyInput')?.value),
        rewardRate: parseFormattedNumber(byId('rewardRateInput')?.value),
        targetQty: parseFormattedNumber(byId('targetQtyInput')?.value),
        currentPrice: parseFormattedNumber(byId('currentPriceInput')?.value),
        feeRate: parseFormattedNumber(byId('feeRateInput')?.value),
        taxRate: parseFormattedNumber(byId('taxRateInput')?.value),
        taxDeduction: parseFormattedNumber(byId('taxDeductionInput')?.value),
        withdrawFee: parseFormattedNumber(byId('withdrawFeeInput')?.value),
        riskMode: Boolean(byId('riskModeInput')?.checked),
        tickerApiUrl: String(byId('tickerApiUrlInput')?.value || '').trim(),
        apiKey: String(byId('apiKeyInput')?.value || '').trim(),
        priceFieldKey: String(byId('priceFieldKeyInput')?.value || '').trim(),
        autoRefreshPrice: Boolean(byId('autoRefreshPriceInput')?.checked)
    });
}

function saveSettingsFromInputs() {
    const oldSettings = loadSettings();

    const rewardQty = parseFormattedNumber(byId('rewardQtyInput')?.value);
    const burnQty = parseFormattedNumber(byId('burnQtyInput')?.value);
    const baseBurnQty = byId('baseBurnQtyInput')?.value === ''
        ? oldSettings.baseBurnQty
        : parseFormattedNumber(byId('baseBurnQtyInput')?.value);
    const rewardRate = byId('rewardRateInput')?.value === ''
        ? oldSettings.rewardRate
        : parseFormattedNumber(byId('rewardRateInput')?.value);
    const targetQty = parseFormattedNumber(byId('targetQtyInput')?.value);
    const currentPrice = parseFormattedNumber(byId('currentPriceInput')?.value);
    const feeRate = byId('feeRateInput')?.value === ''
        ? oldSettings.feeRate
        : parseFormattedNumber(byId('feeRateInput')?.value);
    const taxRate = byId('taxRateInput')?.value === ''
        ? oldSettings.taxRate
        : parseFormattedNumber(byId('taxRateInput')?.value);
    const taxDeduction = byId('taxDeductionInput')?.value === ''
        ? oldSettings.taxDeduction
        : parseFormattedNumber(byId('taxDeductionInput')?.value);
    const withdrawFee = byId('withdrawFeeInput')?.value === ''
        ? oldSettings.withdrawFee
        : parseFormattedNumber(byId('withdrawFeeInput')?.value);
    const riskMode = Boolean(byId('riskModeInput')?.checked);

    saveSettings({
        ...oldSettings,
        rewardQty,
        burnQty,
        baseBurnQty,
        rewardRate,
        targetQty,
        currentPrice,
        feeRate,
        taxRate,
        taxDeduction,
        withdrawFee,
        riskMode
    });

    render();
    closeModal();
}

function saveApiUrlOnly() {
    const settings = loadSettings();

    const nextSettings = {
        ...settings,
        tickerApiUrl: String(byId('tickerApiUrlInput')?.value || '').trim(),
        apiKey: String(byId('apiKeyInput')?.value || '').trim(),
        priceFieldKey: String(byId('priceFieldKeyInput')?.value || '').trim(),
        autoRefreshPrice: Boolean(byId('autoRefreshPriceInput')?.checked)
    };

    saveSettings(nextSettings);

    if (nextSettings.autoRefreshPrice) {
        startAutoPriceRefresh();
    } else {
        stopAutoPriceRefresh();
    }

    renderApiStatus();
    closeModal();
    alert('API 설정이 저장되었습니다.');
}

async function refreshCurrentPrice(options = {}) {
    const force = Boolean(options.force);
    const silent = Boolean(options.silent);
    const now = Date.now();

    if (state.isRefreshingPrice) {
        if (!force) {
            setApiStatus('이미 현재가를 갱신 중입니다.');
        }
        return;
    }

    if (!force && now - state.lastPriceRefreshAt < 2000) {
        const remainMs = 2000 - (now - state.lastPriceRefreshAt);
        const remainSec = (remainMs / 1000).toFixed(1);
        setApiStatus(`너무 빠른 요청입니다. ${remainSec}초 후 다시 시도해 주세요.`);
        return;
    }

    const settings = loadSettings();
    const apiUrl = String(settings.tickerApiUrl || '').trim();
    const priceFieldKey = String(settings.priceFieldKey || '').trim();

    if (!apiUrl) {
        alert('먼저 API 주소를 입력해 주세요.');
        return;
    }

    if (!priceFieldKey) {
        alert('가격 객체 키를 입력해 주세요.');
        return;
    }

    state.isRefreshingPrice = true;
    state.lastPriceRefreshAt = now;
    setApiStatus('현재가를 불러오는 중입니다.');

    const refreshBtn = byId('refreshPriceCardBtn');
    const spinnerStartedAt = Date.now();
    const minimumSpinnerMs = 700;

    if (refreshBtn) {
        refreshBtn.classList.add('loading');
    }

    try {
        const headers = {};
        if (settings.apiKey) {
            headers.Authorization = `Bearer ${settings.apiKey}`;
        }

        const response = await fetch(apiUrl, {
            method: 'GET',
            headers
        });

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }

        const data = await response.json();

        if (!Array.isArray(data) || data.length === 0) {
            throw new Error('응답 배열이 비어 있습니다.');
        }

        const first = data[0];
        const rawPrice = first[priceFieldKey];

        if (rawPrice == null || Number.isNaN(Number(rawPrice))) {
            throw new Error(`${priceFieldKey} 값을 찾을 수 없습니다.`);
        }

        const currentPrice = round2(rawPrice);

        saveSettings({
            ...settings,
            currentPrice,
            apiStatusMessage: `현재 단가 갱신: ${getNowDateTimeText()}`
        });

        fillSettingsInputs();
        render();
    } catch (err) {
        console.error(err);
        setApiStatus(`현재가 갱신 실패: ${err.message}`);

        if (!silent) {
            alert('현재가를 불러오지 못했습니다. API 주소, 가격 객체 키, 브라우저 정책을 확인해 주세요.');
        }
    } finally {
        const elapsed = Date.now() - spinnerStartedAt;
        const remain = minimumSpinnerMs - elapsed;

        if (remain > 0) {
            await new Promise(resolve => setTimeout(resolve, remain));
        }

        state.isRefreshingPrice = false;

        if (refreshBtn) {
            refreshBtn.classList.remove('loading');
        }
    }
}

function stopAutoPriceRefresh() {
    if (state.autoRefreshTimer) {
        clearInterval(state.autoRefreshTimer);
        state.autoRefreshTimer = null;
    }
}

function startAutoPriceRefresh() {
    stopAutoPriceRefresh();

    state.autoRefreshTimer = setInterval(() => {
        refreshCurrentPrice({ force: true, silent: true });
    }, 60 * 1000);
}

function updateBuyAmountPreview() {
    const quantity = parseFormattedNumber(byId('quantity')?.value);
    const manualPrice = parseFormattedNumber(byId('price')?.value);
    const settings = loadSettings();
    const price = manualPrice > 0 ? manualPrice : round2(settings.currentPrice);
    const total = round2(quantity * price);

    if (byId('buyAmountDisplay')) {
        byId('buyAmountDisplay').value = total > 0 ? format2(total) : '';
    }
}

function addTrade() {
    const settings = loadSettings();
    const trades = loadTrades();

    const date = String(byId('date')?.value || '').trim();
    const quantity = parseFormattedNumber(byId('quantity')?.value);
    const manualPrice = parseFormattedNumber(byId('price')?.value);
    const price = manualPrice > 0 ? manualPrice : round2(settings.currentPrice);
    const memo = String(byId('memo')?.value || '').trim();

    if (!date) {
        alert('날짜를 입력해 주세요.');
        return;
    }

    if (quantity <= 0) {
        alert('수량을 입력해 주세요.');
        return;
    }

    if (price <= 0) {
        alert('단가를 입력해 주세요.');
        return;
    }

    trades.push(normalizeTrade({
        id: Date.now(),
        createdAt: Date.now(),
        date,
        quantity,
        price,
        memo
    }));

    saveTrades(trades);
    state.page = 1;
    render();
    closeModal();
}

function removeTrade(deleteId) {
    const trades = loadTrades();
    const nextTrades = trades.filter(item => Number(item.id) !== Number(deleteId));
    saveTrades(nextTrades);
    render();
}

function exportData() {
    const payload = {
        app: 'CADS',
        backupType: 'cads-backup',
        version: 1,
        trades: loadTrades(),
        settings: loadSettings(),
        news: loadNewsItems(),
        exportedAt: getNowDateTimeText()
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');

    anchor.href = url;
    anchor.download = `cads-backup-${getTodayDateString()}.json`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    URL.revokeObjectURL(url);
}

function importData() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'application/json,.json';

    input.addEventListener('change', async event => {
        const file = event.target.files?.[0];
        if (!file) return;

        try {
            // ✅ 1차: JSON 파일 여부 검사 (확장자 + MIME)
            const isJsonExtension = file.name.toLowerCase().endsWith('.json');
            const isJsonMime = file.type === 'application/json' || file.type === '';

            if (!isJsonExtension && !isJsonMime) {
                throw new Error('JSON 파일만 복원할 수 있습니다.');
            }

            const text = await file.text();

            // ✅ 2차: JSON 파싱 검사
            let parsed;
            try {
                parsed = JSON.parse(text);
            } catch {
                throw new Error('JSON 형식이 올바르지 않습니다.');
            }

            // ✅ 3차: CADS 식별자 검사
            if (parsed.app !== 'CADS' || parsed.backupType !== 'cads-backup') {
                throw new Error('CADS 백업 파일이 아닙니다.');
            }

            // ✅ 4차: 최소 구조 검사
            if (!Array.isArray(parsed.trades)) {
                throw new Error('거래 기록 데이터가 없습니다.');
            }

            if (!parsed.settings || typeof parsed.settings !== 'object') {
                throw new Error('설정 데이터가 없습니다.');
            }

            if (!Array.isArray(parsed.news)) {
                throw new Error('참고자료 데이터가 없습니다.');
            }

            // 정상 복원
            const nextTrades = parsed.trades.map(normalizeTrade);
            const nextSettings = normalizeSettings(parsed.settings);
            const nextNews = parsed.news.map(normalizeNewsItem);

            saveTrades(nextTrades);
            saveSettings({
                ...nextSettings,
                apiStatusMessage: '백업 파일에서 복원되었습니다.'
            });
            saveNewsItems(nextNews);

            if (nextSettings.autoRefreshPrice) {
                startAutoPriceRefresh();
            } else {
                stopAutoPriceRefresh();
            }

            state.page = 1;
            render();
            fillSettingsInputs();
            fillApiInputs();
            closeModal();

            alert('백업 파일을 복원했습니다.');
        } catch (err) {
            console.error(err);
            alert(err.message || '백업 파일을 불러오지 못했습니다.');
        }
    });

    input.click();
}


function resetTrades() {
    openConfirmModal('모든 데이터를 초기화하시겠습니까?', () => {
        localStorage.removeItem(STORAGE_KEY_TRADES);
        localStorage.removeItem(STORAGE_KEY_SETTINGS);
        localStorage.removeItem(STORAGE_KEY_NEWS);

        stopAutoPriceRefresh();
        state.settings = null;

        state.page = 1;
        render();
    }, {
        confirmText: '초기화'
    });
}

function attachCommaFormatter(inputId) {
    const input = byId(inputId);
    if (!input) return;

    input.addEventListener('input', event => {
        const rawValue = event.target.value;
        const formatted = formatGeneralNumberInput(rawValue);
        event.target.value = formatted;

        if (inputId === 'quantity' || inputId === 'price') {
            updateBuyAmountPreview();
        }
    });
}

mainTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const tabName = tab.dataset.tab;
        if (!tabName) return;
        switchTab(tabName);
    });
});

sortButtons.forEach(button => {
    button.addEventListener('click', () => {
        const nextKey = button.dataset.sort;

        if (state.sortKey === nextKey) {
            state.sortDirection = state.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            state.sortKey = nextKey;
            state.sortDirection = 'desc';
        }

        state.page = 1;
        renderHistoryTable();
    });
});

pageSizeSelect?.addEventListener('change', event => {
    state.pageSize = Number(event.target.value || 20);
    state.page = 1;
    renderHistoryTable();
});

firstPageButton?.addEventListener('click', () => {
    state.page = 1;
    renderHistoryTable();
});

prevPageButton?.addEventListener('click', () => {
    state.page = Math.max(1, state.page - 1);
    renderHistoryTable();
});

nextPageButton?.addEventListener('click', () => {
    const totalPages = Math.max(1, Math.ceil(loadTrades().length / state.pageSize));
    state.page = Math.min(totalPages, state.page + 1);
    renderHistoryTable();
});

lastPageButton?.addEventListener('click', () => {
    state.page = Math.max(1, Math.ceil(loadTrades().length / state.pageSize));
    renderHistoryTable();
});

historyTableBody?.addEventListener('click', event => {
    const editButton = event.target.closest('[data-edit-id]');
    if (!editButton) return;

    const tradeId = Number(editButton.dataset.editId);
    openEditTradeModal(tradeId);
});

modalOpenTriggers.forEach(trigger => {
    trigger.addEventListener('click', () => {
        const modalName = trigger.dataset.openModal;

        if (modalName === 'settings-all') {
            fillAllSettingsInputs();
        }

        if (modalName === 'buy-record') {
            openAddTradeModal();
            return;
        }

        openModal(modalName);
    });
});

modalCloseTriggers.forEach(trigger => {
    trigger.addEventListener('click', closeModal);
});

window.addEventListener('keydown', event => {
    if (event.key === 'Escape') {
        closeModal();
    }
});

byId('saveAllSettingsBtn')?.addEventListener('click', saveAllSettingsFromInputs);
byId('refreshPriceBtn')?.addEventListener('click', () => refreshCurrentPrice());
byId('refreshPriceCardBtn')?.addEventListener('click', () => refreshCurrentPrice());
byId('exportBtn')?.addEventListener('click', exportData);
byId('importBtn')?.addEventListener('click', importData);
byId('resetBtn')?.addEventListener('click', resetTrades);
byId('addBtn')?.addEventListener('click', submitTrade);

byId('deleteTradeBtn')?.addEventListener('click', () => {
    if (state.editingTradeId == null) return;

    const ok = confirm('이 매수 기록을 삭제할까요?');
    if (!ok) return;

    removeTrade(state.editingTradeId);
    closeModal();
    render();
});

byId('confirmCancelBtn')?.addEventListener('click', () => {
    state.confirmAction = null;
    closeModal();
});

byId('confirmOkBtn')?.addEventListener('click', () => {
    runConfirmAction();
});

byId('addRewardTopBtn')?.addEventListener('click', () => {
    fillAddRewardInputs();
    openModal('add-reward');
});

byId('saveAddRewardBtn')?.addEventListener('click', addRewardQty);

byId('addBurnTopBtn')?.addEventListener('click', () => {
    fillAddBurnInputs();
    openModal('add-burn');
});

byId('saveAddBurnBtn')?.addEventListener('click', addBurnQty);

byId('addNewsTopBtn')?.addEventListener('click', () => {
    openAddNewsModal();
});

byId('saveAddNewsBtn')?.addEventListener('click', () => {
    submitNewsItem();
});

byId('deleteNewsBtn')?.addEventListener('click', () => {
    if (state.editingNewsId == null) return;

    const ok = confirm('이 참고자료를 삭제할까요?');
    if (!ok) return;

    removeNewsItem(state.editingNewsId);
    closeModal();
});

byId('newsList')?.addEventListener('click', event => {
    const editButton = event.target.closest('[data-news-edit-id]');
    if (!editButton) return;

    const newsId = Number(editButton.dataset.newsEditId);
    openEditNewsModal(newsId);
});

const openRewardTargetFromEmptyBtn = byId('openRewardTargetFromEmpty');

if (openRewardTargetFromEmptyBtn) {
    openRewardTargetFromEmptyBtn.addEventListener('click', () => {
        fillAllSettingsInputs();
        openModal('settings-all');
    });
}

[
    'rewardQtyInput',
    'burnQtyInput',
    'baseBurnQtyInput',
    'rewardRateInput',
    'targetQtyInput',
    'currentPriceInput',
    'feeRateInput',
    'taxRateInput',
    'taxDeductionInput',
    'withdrawFeeInput',
    'tickerApiUrlInput',
    'apiKeyInput',
    'priceFieldKeyInput'
].forEach(inputId => {
    const el = byId(inputId);
    if (!el) return;

    el.addEventListener('input', () => {
        syncSettingsDraftFromInputs();
        renderSummary();
    });
});

byId('riskModeInput')?.addEventListener('change', () => {
    syncSettingsDraftFromInputs();
    renderSummary();
});

byId('autoRefreshPriceInput')?.addEventListener('change', () => {
    syncSettingsDraftFromInputs();
    renderSummary();
});

[
    'quantity',
    'price',
    'rewardQtyInput',
    'burnQtyInput',
    'baseBurnQtyInput',
    'rewardRateInput',
    'targetQtyInput',
    'currentPriceInput',
    'feeRateInput',
    'taxRateInput',
    'taxDeductionInput',
    'withdrawFeeInput',
    'addRewardQtyInput',
    'addBurnQtyInput'
].forEach(attachCommaFormatter);

state.settings = normalizeSettings(loadSettings());
render();
fillAllSettingsInputs();

const validTabs = ['dashboard', 'history', 'news'];
const hashTab = location.hash ? location.hash.replace('#', '') : '';
const initialTab = validTabs.includes(hashTab) ? hashTab : 'dashboard';

mainTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.tab === initialTab);
});

pages.forEach(page => {
    page.classList.toggle('active', page.id === initialTab);
});

subMenus.forEach(menu => {
    menu.classList.toggle('active', menu.dataset.submenu === initialTab);
});

window.addEventListener('DOMContentLoaded', async () => {
    await new Promise(resolve => setTimeout(resolve, 180));
    hidePageLoading();
});

window.addEventListener('load', () => {
    if (state.settings.autoRefreshPrice) {
        refreshCurrentPrice({ force: true, silent: true });
        startAutoPriceRefresh();
    } else {
        stopAutoPriceRefresh();
    }
});
