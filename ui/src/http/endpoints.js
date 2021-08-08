import awsconfig from '@/aws-exports'

const AWS_HOSTED_UI_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/login';
const AWS_LOGOUT_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/logout';
const AWS_AUTHORIZATION_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/oauth2/authorize';
const AWS_TOKEN_ENDPOINT = 'https://' + awsconfig.Auth.oauth.domain + '/oauth2/token';

const API_BASEURL = import.meta.env.VITE_API_BASEURL

export default {
  AWS_AUTHORIZATION_ENDPOINT,
  AWS_HOSTED_UI_ENDPOINT,
  AWS_TOKEN_ENDPOINT,
  AWS_LOGOUT_ENDPOINT,
  API_BASEURL,
}