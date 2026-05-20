import { website_name } from '../config/app-config';
import { getAppId } from '../config/config';
import { routes } from '../routes/routes';
import { CookieStorage, isStorageSupported, LocalStore } from '../storage/storage';
import { getHubSignupUrl } from '../url';

const LEGACY_OAUTH_AUTHORIZE_URL = 'https://oauth.deriv.com/oauth2/authorize';

export const redirectToLogin = (is_logged_in: boolean, language: string, has_params = true, redirect_delay = 0) => {
    if (!is_logged_in && isStorageSupported(sessionStorage)) {
        const l = window.location;
        const redirect_url = has_params ? window.location.href : `${l.protocol}//${l.host}${l.pathname}`;
        sessionStorage.setItem('redirect_url', redirect_url);
        setTimeout(() => {
            const new_href = loginUrl({ language });
            window.location.href = new_href;
        }, redirect_delay);
    }
};

export const redirectToSignUp = () => {
    const location = window.location.href;
    const isDtraderRoute = window.location.pathname.includes(routes.trade);

    if (isDtraderRoute) {
        window.open(getHubSignupUrl(location));
    } else {
        window.open(getHubSignupUrl());
    }
};

type TLoginUrl = {
    language: string;
};

export const loginUrl = ({ language }: TLoginUrl) => {
    const server_url = LocalStore.get('config.server_url');
    const change_login_app_id = LocalStore.get('change_login_app_id');
    const should_use_change_login_app_id = !/localhost/i.test(window.location.hostname) && change_login_app_id;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signup_device_cookie = new (CookieStorage as any)('signup_device');
    const signup_device = signup_device_cookie.get('signup_device');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date_first_contact_cookie = new (CookieStorage as any)('date_first_contact');
    const date_first_contact = date_first_contact_cookie.get('date_first_contact');
    const marketing_queries = `${signup_device ? `&signup_device=${signup_device}` : ''}${
        date_first_contact ? `&date_first_contact=${date_first_contact}` : ''
    }`;

    const getOAuthUrl = () =>
        `${LEGACY_OAUTH_AUTHORIZE_URL}?app_id=${should_use_change_login_app_id || getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;

    if (server_url && /qa/.test(server_url)) {
        return `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}`;
    }

    return getOAuthUrl();
};
