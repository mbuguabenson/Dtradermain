import { website_name } from '../config/app-config';
import { domain_app_ids, getAppId } from '../config/config';
import { CookieStorage, isStorageSupported, LocalStore } from '../storage/storage';
import { getHubSignupUrl, urlForCurrentDomain } from '../url';
import { deriv_urls } from '../url/constants';
import { routes } from '../routes/routes';

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
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const signup_device_cookie = new (CookieStorage as any)('signup_device');
    const signup_device = signup_device_cookie.get('signup_device');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const date_first_contact_cookie = new (CookieStorage as any)('date_first_contact');
    const date_first_contact = date_first_contact_cookie.get('date_first_contact');
    const marketing_queries = `${signup_device ? `&signup_device=${signup_device}` : ''}${
        date_first_contact ? `&date_first_contact=${date_first_contact}` : ''
    }`;

    const getOAuthUrl = () => {
        const redirect_uri = `${window.location.protocol}//${window.location.host}${window.location.pathname === '/' ? '' : window.location.pathname}`;
        return `https://oauth.${
            deriv_urls.DERIV_HOST_NAME
        }/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}&redirect_uri=${redirect_uri}&state=`;
    };

    if (server_url && /qa/.test(server_url)) {
        const redirect_uri = `${window.location.protocol}//${window.location.host}${window.location.pathname === '/' ? '' : window.location.pathname}`;
        return `https://${server_url}/oauth2/authorize?app_id=${getAppId()}&l=${language}${marketing_queries}&brand=${website_name.toLowerCase()}&redirect_uri=${redirect_uri}&state=`;
    }

    return getOAuthUrl();
};
