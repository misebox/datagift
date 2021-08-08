export default {
  DEBUG: import.meta.env.MODE !== 'production',
  DOMAIN: import.meta.env.VITE_DOMAIN,
  API_BASEURL: import.meta.env.VITE_API_BASEURL,
  auth: {
    REGION: import.meta.env.VITE_AUTH_REGION,
    USER_POOL_ID: import.meta.env.VITE_AUTH_USER_POOL_ID,
    USER_POOL_CLIENT_ID: import.meta.env.VITE_AUTH_USER_POOL_CLIENT_ID,
    COGNITO_DOMAIN: import.meta.env.VITE_AUTH_COGNITO_DOMAIN,
    REDIRECT_SIGNIN: import.meta.env.VITE_AUTH_REDIRECT_SIGNIN,
    REDIRECT_SIGNOUT: import.meta.env.VITE_AUTH_REDIRECT_SIGNOUT,
  },
};
