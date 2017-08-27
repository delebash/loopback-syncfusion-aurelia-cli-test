import {inject} from 'aurelia-framework';
import {AuthenticationService} from '../services/auth-service'
import {LoopBackAdaptor} from '../services/syncfusion-loopback-adaptor';
import {Endpoint} from 'aurelia-api';

@inject(AuthenticationService,LoopBackAdaptor)
export class GridQuery {
  constructor(authservice,adaptor) {
    this.authservice = authservice
    this.adaptor = adaptor
  }

  attached() {
    if (this.authservice.authenticated === false) {
      alert('please login')
    } else {
      this.getdata();
    }
  }

  getdata() {
    //requestType = "get" -- request uses query string params via get, "json" -- request uses post to send an object
    let adaptorOptions = {requestType: "get"}; //defaults to "get" if not specified or not passed in

    let dataManager = ej.DataManager({
      url: "http://localhost:3000/api/customers",
      adaptor: new this.adaptor.loopbackAdaptor(adaptorOptions),
    });

    $("#Grid").ejGrid({
      dataSource: dataManager,
      toolbarSettings: {
        showToolbar: true,
        toolbarItems: ["add", "edit", "delete"]
      },
      editSettings: {
        allowEditing: true,
        allowAdding: true,
        allowDeleting: true,
        editMode: "dialog"
      },
      allowPaging: true,
      allowSorting: true,
      allowFiltering: true,
      filterSettings: {showPredicate: true, filterType: "menu", enableCaseSensitivity: true},
      isResponsive: true,
      columns: [
        {field: "id", headerText: "id", width: 110},
        {field: "lastName", headerText: "Last Name", width: 110},
        {field: "company", headerText: "Company", width: 110}
      ]
    });
  }
}

