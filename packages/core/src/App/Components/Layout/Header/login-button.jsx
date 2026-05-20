import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { getAppId } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';

const LoginButton = ({ className }) => {
    const handleLogin = () => {
        // OAuth redirect URL - where Deriv will send the user back with tokens
        const redirect_url = `${window.location.origin}/redirect`;

        // Get the app ID from configuration
        const app_id = getAppId();

        // Build OAuth authorization URL
        const oauth_url =
            `https://oauth.deriv.com/oauth2/authorize` +
            `?app_id=${app_id}` +
            `&l=${getLanguage().toUpperCase()}` +
            `&brand=deriv` +
            `&redirect_uri=${encodeURIComponent(redirect_url)}`;

        // Redirect to Deriv login
        window.location.href = oauth_url;
    };

    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={handleLogin}
            tertiary
        />
    );
};

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
