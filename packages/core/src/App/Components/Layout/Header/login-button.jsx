import React from 'react';
import PropTypes from 'prop-types';

import { Button } from '@deriv/components';
import { redirectToLogin } from '@deriv/shared';
import { getLanguage, localize } from '@deriv/translations';

const LoginButton = ({ className }) => {
    return (
        <Button
            id='dt_login_button'
            className={className}
            has_effect
            text={localize('Log in')}
            onClick={async () => {
                window.LiveChatWidget?.call('hide');
                redirectToLogin(false, getLanguage());
            }}
            tertiary
        />
    );
};

LoginButton.propTypes = {
    className: PropTypes.string,
};

export { LoginButton };
