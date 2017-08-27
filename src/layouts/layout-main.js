import {inject} from 'aurelia-framework';
import routes from '../startup/routes'

// Load routes from /config/config.routes
export class App {
  configureRouter(config, router) {
    config.title = 'Aurelia';
    config.map(routes);
    config.mapUnknownRoutes("viewmodels/notfound");
    this.router = router;
  }
}
