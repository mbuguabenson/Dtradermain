import { redirectToLogin } from '@deriv/shared';
import { useStore } from '@deriv/stores';
import { getLanguage, localize } from '@deriv/translations';

/**
 * Provides an object with one properties: `oAuthLogout`.
 *
 * `oAuthLogout` is a function that logs out the user of the OAuth2-enabled app.
 *
 * The `handleLogout` argument is an optional function that will be called after logging out the user.
 * If `handleLogout` is not provided, the function will resolve immediately.
 *
 * @param {{ handleLogout?: () => Promise<void> }} [options] - An object with an optional `handleLogout` property.
 * @returns {{ oAuthLogout: () => Promise<void> }}
 */
const useOauth2 = ({ handleLogout }: { handleLogout: () => Promise<void> }) => {
    const { common, client } = useStore();

    const loginHandler = async () => {
        redirectToLogin(false, getLanguage());
    };

    const logoutHandler = async () => {
        try {
            if (handleLogout) {
                await handleLogout();
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);

            client.setIsSingleLoggingIn(false);

            if (common.setError) {
                common.setError(true, {
                    code: 'LogoutError',
                    message: localize('Failed while logging out, please login'),
                    should_show_refresh: false,
                    redirect_label: localize('Log in'),
                    redirectOnClick: () => loginHandler(),
                });
            }
        }
    };

    return { oAuthLogout: logoutHandler, loginHandler };
};

export default useOauth2;
