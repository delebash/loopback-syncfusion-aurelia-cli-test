import {Router} from 'aurelia-router';
import {inject} from 'aurelia-framework';
import {SharedService} from './shared-service';
import {Endpoint} from 'aurelia-api';
@inject(Router, SharedService, Endpoint.of('api'))
export class Admin {
  constructor(router, sharedService, api) {
    this.router = router;
    this.sharedService = sharedService
    this.api = api

  }

  async created() {
    let data = await this.api.find('customers');
    this.contacts = data.rows
  }

  select(contact) {
    this.sharedService.data = contact;
    this.router.navigateToRoute('detail', {id: contact.id})
  }
}


// attached() {
  // $('#myTable tbody tr').click(function () {
  //   alert('testcontact')
  //   $(this).addClass('table-active').siblings().removeClass('table-active');
  // });
// }

// activate(params, routeConfig) {
//
// }
// this.sharedService.getContactList().then(contacts => this.contacts = contacts);
//this.contacts = this.sharedService.contacts
