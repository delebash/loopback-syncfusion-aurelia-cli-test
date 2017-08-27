import environment from '../environment';

export function configureResources(aurelia, globalConfig) {
    if (environment.testing) {
        aurelia.use
            .globalResources([]);
    }
}
