import { createApp } from 'vue';
import App from './App.vue';
import router from '@/router';
import awsconfig from '@/aws-exports';
import {configure as userPoolConfigure} from '@/userpool-wrapper';
import store from '@/store'
console.log(import.meta.env.MODE)


const cognitoConfig = {
  UserPoolId: awsconfig.Auth.userPoolId,
  ClientId: awsconfig.Auth.userPoolWebClientId,
  endpoint: awsconfig.Auth.oauth.domain.VITE_AUTH_COGNITO_DOMAIN,
  Storage: window.sessionStorage,
  //AdvancedSecurityDataCollectionFlag: ,
};
userPoolConfigure(cognitoConfig);

createApp(App)
  .use(router)
  .use(store)
  .mount('#app')
