const debug = import.meta.env.MODE !== 'production'

export default {
  Auth: {
    //identityPoolId: import.meta.env.VITE_AUTH_IDENTITY_POOL_ID,

    // Amazon Cognito Region
    region: import.meta.env.VITE_AUTH_REGION,

    // Amazon Cognito User Pool ID
    userPoolId: import.meta.env.VITE_AUTH_USER_POOL_ID,

    // Amazon Cognito Web Client ID (26-char alphanumeric string)
    userPoolWebClientId: import.meta.env.VITE_AUTH_USER_POOL_CLIENT_ID,

    // Enforce user authentication prior to accessing AWS resources or not
    mandatorySignIn: false,


    cookieStorage: {
      domain: import.meta.env.VITE_DOMAIN,
      path: '/',
      expires: 14,
      sameSite: "strict",
      secure: !debug
    },

    // authenticationFlowType: 'USER_SRP_AUTH',
    clientMetadata: {},
    // OPTIONAL - Hosted UI configuration
    oauth: {
      domain: import.meta.env.VITE_AUTH_COGNITO_DOMAIN,
      scope: ['email', 'profile', 'openid'],
      redirectSignIn: import.meta.env.VITE_AUTH_REDIRECT_SIGNIN,
      redirectSignOut: import.meta.env.VITE_AUTH_REDIRECT_SIGNOUT,
      responseType: 'code'
    }
  }
}
