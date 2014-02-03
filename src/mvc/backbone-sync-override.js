(function(window) {

    define([ 'backbone', 'auth/auth', 'httpstatus', 'router' ], function(Backbone, Auth, httpstatus, Router) {

        var init = function() {
            Backbone.sync = createSyncMethod(Backbone.sync);
        };

        var createSyncMethod = function(oldSync) {
            return function(method, model, options) {
                if (model.disableAuthSync) {
                    return oldSync.apply(this, [ method, model, options ]);
                }

                options = options || {};
                configureErrorHandler(options);
                //addAccessTokenHeader(options);

                return oldSync.apply(this, [ method, model, options ]);
            };
        };

        var configureErrorHandler = function(options) {
            var errorHandler = options.error;
            var currentAuthToken = Auth.get('access_token');
            options.error = function(xhr) {
                if (isAuthRequired(xhr.status)) {
                    Auth.clear();
                    Router.showLogin();
                    return;
                }
                errorHandler && errorHandler.apply(this, arguments);
            };
        };

        var addAccessTokenHeader = function(options) {
            options.headers = options.headers || {};
            options.headers['access-token'] = Auth.get('access_token');
        };

        var isAuthRequired = function(httpStatus) {
            return httpStatus === httpstatus.UNAUTHORIZED;
        };

        return {
            init: init
        };
    });

}(window));
