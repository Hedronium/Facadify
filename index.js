module.exports = function facadize(instance, facade) {
    facade = facade || {};
    facade.__facadeRoot = instance;
    facade.__addedFacadeMethods = [];

    facade.getFacadeRoot = function () {
        return facade.__facadeRoot;
    }

    facade.swapFacadeRoot = function (new_instance) {
        var method;

        while (method = facade.__addedFacadeMethods.pop()) {
            delete facade[method];
        }

        facadize(new_instance, facade);
    }

    for (var property in instance) {
        if (instance[property] instanceof Function) {
            facade.__addedFacadeMethods.push(property);

            facade[property] = (function (property) {
                return function () {
                    return facade.__facadeRoot[property].apply(facade.__facadeRoot, arguments);
                }
            })(property);
        }
    }

    return facade;
}
