import {AuthService} from 'aurelia-authentication';
import {Endpoint} from 'aurelia-api';
import {inject, computedFrom} from 'aurelia-framework';
import {log} from '../services/logger';

@inject(AuthService, Endpoint.of('api'))
export class AuthenticationService {
  constructor(authservice, api) {
    this.api = api;
    this.authservice = authservice;
    this.username = null;
  };


  // make a getter to get the authentication status.
  // use computedFrom to avoid dirty checking
  @computedFrom('authservice.authenticated')
  get authenticated() {
    return this.authservice.authenticated;
  }

  get sessiontoken() {
    return this.authservice.getAccessToken()
  }
  }
