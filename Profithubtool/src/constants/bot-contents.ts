type TTabsTitle = {
    [key: string]: string | number;
};

type TDashboardTabIndex = {
    [key: string]: number;
};

export const tabs_title: TTabsTitle = Object.freeze({
    WORKSPACE: 'Workspace',
    CHART: 'Chart',
});

export const DBOT_TABS: TDashboardTabIndex = Object.freeze({
    DASHBOARD: 0,
    DTRADER: 1,
    BOT_BUILDER: 2,
    CHART: 3,
    EASY_TOOL: 4,
    FREE_BOTS: 5,
    SIGNALS: 6,
    SIGNAL_CENTRE: 7,
    PRO_TOOL: 8,
    SMART_AUTO24: 9,
    MARKETKILLER: 10,
    RISK_MANAGEMENT: 11,
});

export const MAX_STRATEGIES = 10;

export const TAB_IDS = [
    'id-dbot-dashboard',
    'id-dtrader',
    'id-bot-builder',
    'id-charts',
    'id-easy-tool',
    'id-free-bots',
    'id-signals',
    'id-signal-centre',
    'id-pro-tool',
    'id-smart-auto',
    'id-marketkiller',
    'id-risk-management',
];

export const DEBOUNCE_INTERVAL_TIME = 500;
