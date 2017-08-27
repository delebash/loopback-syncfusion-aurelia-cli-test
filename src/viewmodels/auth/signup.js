import {inject} from 'aurelia-framework';
import {AuthService} from 'aurelia-authentication';

@inject(AuthService)
export class Signup {
  constructor(auth) {
    this.auth = auth;
  }

  heading = 'Sign Up';
  realm = "dfg";
  displayName = '';
  emailVerified = true;
  verificationtoken = 'sdf';
  email = '';
  password = '';

  signup() {
    return this.auth.signup({
      email: this.email,
      password: this.password,
      emailverified: this.emailVerified,
      realm: this.realm,
      displayname: 'asdf',
      username: this.email,
      verificationtoken : this.verificationtoken
    });
  }
}
