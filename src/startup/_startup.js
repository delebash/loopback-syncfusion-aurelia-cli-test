//#region import

import './_polyfills';
import environment from '../environment';
import {configurePlugins} from './plugins';
import {configureFeatures} from './features';
import {configureResources} from './resources';
import {LogManager} from 'aurelia-framework';
import {CustomLogAppender} from '../services/logger';
import {UndandledErrorHandler} from "../services/errorhandler"


LogManager.addAppender(new CustomLogAppender());

//#endregion

//Configure Bluebird Promises.
//Note: You may want to use environment-specific configuration.
(Promise).config({
  warnings: {
    wForgottenReturn: false
  }
});

export class Startup {

  //#region Properties

  aurelia;

  //#endregion

  constructor() {

  }

  //#region Init+Start

  init(aurelia) {

    //Load error handler
      UndandledErrorHandler.init()

    let t = this;
    t.aurelia = aurelia;

    t.aurelia.use
      .standardConfiguration();

    if (environment.debug) {
      //  aurelia.use.developmentLogging();
      LogManager.setLevel(LogManager.logLevel.debug);
    }

    if (environment.testing) {
      aurelia.use.plugin('aurelia-testing');
    }

    configureFeatures(t.aurelia);
    configurePlugins(t.aurelia);
    configureResources(t.aurelia);

    // UndandledErrorHandler.errorhandler();

    aurelia.start().then(() => aurelia.setRoot('layouts/layout-main'));
  }
}


