export default {
  //--------------------------------------------------------------------------
//  DreamFactory 2.0 instance specific constants
//--------------------------------------------------------------------------
  INSTANCE_URL: 'https://api.ageektech.com',
  APP_API_KEY: '24b66b53bdb0d8209d55a6e541de2def9759f195aa8a254a8a40ff7f0c9d5dc4',
  APP_NAME: 'northwind-app',
  email: 'dftester@ageektech.com',
  password: 'test12345',
  api: '/api',
  db: 'northwind/',
  service: '_table/',
  serviceObject: 'customers',
  tokenKey: 'token',
  overrideMethod: '?method=GET',
  dataurl: function () {
    return this.baseurl() + this.serviceObject + this.overrideMethod;
  },
  baseurl: function () {
    return this.INSTANCE_URL + this.api + this.service;
  },
  loginurl: function () {
    return this.INSTANCE_URL + '/api/v2/user/session'
  },
  credentials: function () {
    return {email: this.email, password: this.password}
  }
};
