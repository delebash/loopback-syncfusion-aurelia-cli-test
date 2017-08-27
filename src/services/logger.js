import {LogManager} from "aurelia-framework";

export class CustomLogAppender {
  constructor(){}
  debug(logger, message, ...rest){
    console.debug(`DEBUG [${logger.id}] ${message}`, ...rest);
  }
  info(logger, message, ...rest){
    console.info(`INFO [${logger.id}] ${message}`, ...rest);
  }
  warn(logger, message, ...rest){
    console.warn(`WARN [${logger.id}] ${message}`, ...rest);
  }
  error(logger, message, ...rest){
    if (typeof message === 'object'){
      console.log(message)
    }
    console.error(`ERROR [${logger.id}] ${message}`, ...rest);
  }
}

export let log = LogManager.getLogger('APP');

