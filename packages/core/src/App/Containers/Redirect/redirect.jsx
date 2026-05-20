import React, { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

const RedirectPage = () => {
    const history = useHistory();

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);

        const accounts = [];
        let i = 1;

        while (params.get(`acct${i}`)) {
            accounts.push({
                account: params.get(`acct${i}`),
                token: params.get(`token${i}`),
                currency: params.get(`cur${i}`),
            });

            i++;
        }

        console.log('Accounts:', accounts);

        // Save to localStorage using the custom app format
        if (accounts.length > 0) {
            localStorage.setItem(
                'deriv_accounts',
                JSON.stringify(accounts)
            );

            // Use first account
            const first_account = accounts[0];

            if (first_account?.token) {
                localStorage.setItem(
                    'active_token',
                    first_account.token
                );

                // Also populate client.accounts for compatibility with deriv core
                const client_accounts = {};
                accounts.forEach((acc) => {
                    client_accounts[acc.account] = {
                        token: acc.token,
                        currency: acc.currency,
                        is_virtual: /^VR/.test(acc.account) ? 1 : 0
                    };
                });
                localStorage.setItem('client.accounts', JSON.stringify(client_accounts));
                localStorage.setItem('active_loginid', first_account.account);
                
                // Redirect into app
                window.location.href = '/';
            }
        } else {
            // No tokens, redirect to home anyway
            history.push('/');
        }
    }, [history]);

    return <div>Logging in...</div>;
};

export default RedirectPage;
