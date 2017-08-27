import { inject } from 'aurelia-framework';
import { Endpoint} from 'aurelia-api';

@inject(Endpoint.of('api'))  // the 'api' endpoint with Authorization header
export class Get {


  role = '';
  model = '';
  roleid = '';

  constructor(rest) {
    this.apiEndpoint = rest;

  }
     activate(){

 }
  roleById() {
    return this.apiEndpoint.request('POST', 'users/findByRole',{"role": this.roleid});

  }

  getAll() {
    return this.apiEndpoint.find(this.model);
  }
  getAllRoles() {
    return this.apiEndpoint.request('GET', 'users/myrole');
  }
  getSuppliers() {
    return this.apiEndpoint.request('POST', 'suppliers/greet',{"msg":"test"});
  }
  addRole(){
    return this.apiEndpoint.request('POST', 'users/addRole',{"role": this.role});
  }
}
