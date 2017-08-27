export default {
  endpoint: 'auth',
  configureEndpoints: ['auth', 'api'],  // add Authorization headers to those for authenticated requests
  baseUrl: 'http://localhost:3000/api/users/',
  loginUrl:'login',
  signupUrl : '',
  httpInterceptor: true, // true=add auth token to httpInterceptor
  loginOnSignup: false,
  loginRedirect: '#/profile',  // internal aurelia redirect root
  signupRedirect: '#/login', // internal aurelia redirect root
  logoutRedirect: '#/login',
  expiredRedirect: 1,
  loginRoute: '/login',
  authToken: '',  // 'prefix' for header token. ''=empty for loopback
  useRefreshToken: true,
  profileUrl: 'me', // api profile url
  unlinkUrl: 'me/unlink/', // api unlink third-party url
};
