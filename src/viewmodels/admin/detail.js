import {inject} from 'aurelia-framework';
import {Router} from 'aurelia-router';
import {SharedService} from './shared-service';
import {Endpoint} from 'aurelia-api';

@inject(SharedService, Endpoint.of('api'), Router)
export class AdminDetail {
  constructor(sharedService, api, router) {
    this.sharedService = sharedService;
    this.api = api;
    this.router = router;
  }
  activate(params, routeConfig) {
    this.contact = this.sharedService.data;
  }

  attached() {
    $("#success-alert").hide();
  }

  get canSave() {
    return this.contact.firstName && this.contact.lastName;
  }

  async save() {
    let router = this.router
    // let data = await this.api.find('customers');
    let data = await this.api.patch('customers', this.contact.id, this.contact);
    $("#success-alert").show();
    setTimeout(function () {
     // $("#success-alert").hide();
      router.navigateToRoute('list')
    }, 2000);

  }
}
