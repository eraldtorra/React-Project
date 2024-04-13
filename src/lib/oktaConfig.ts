export const oktaConfig = {
    clientId: '0oag7m41baZ5e9GRN5d7',
    issuer: 'https://dev-61036179.okta.com/oauth2/default',
    redirectUri: 'https://localhost:3000/login/callback',
    scopes: ['openid', 'profile', 'email'],
    pkce: true,
    disableHttpsCheck: true,
    
}