(function(window) {
    'use strict';

    define(['backbone', 'json2', 'localstorage', 'httpstatus'], function(Backbone, JSON, localStorage, httpstatus) {
        /**
         * Auth Model
         *
         * The Auth Model is a singleton and has no constructor
         * @example
         * var auth = Auth;
         *
         * To login save the auth model with the `provider` and matching auth
         * attributes.
         * @example
         * Auth.save({provider:'email', email:'don@email.com', secret:'donssecret'});
         */
        var Auth = (function() {
            var savedSession = null;
            if (localStorage.auth) {
                try {
                    savedSession = JSON.parse(localStorage.auth);
                } catch (err) { }
            }

            return new (Backbone.Model.extend({
                disableAuthSync: true,

                initialize: function() {
                    this.on('change', function() {
                        localStorage.auth = this.serialize();
                    });
                },

                defaults: {
                    action: 'authenticate'
                },

                url: '/api/authenticate',

                idAttribute: 'user_id',

                isLoggedIn: function() {
                    return !!this.get('access_token');
                },

                clear: function() {
                    Backbone.Model.prototype.clear.apply(this);
                    this.set(this.defaults);
                },

                serialize: function() {
                    return JSON.stringify({
                        'provider': this.get('provider'),
                        'email': this.get('email'),
                        'user_id': this.get('user_id'),
                        'access_token': this.get('access_token')
                    });
                },

                login: function(data, options) {
                    data.action = 'authenticate';
                    this._sendAuth(data, options, this._getLoginErrorMessage);
                },

                register: function(data, options) {
                    data.action = 'register';
                    this._sendAuth(data, options, this._getRegistrationErrorMessage);
                },

                _sendAuth: function(data, options, errorMessageCallback) {
                    this.clear();
                    this.save(data, {
                        success: function() {
                            if (options.success) { options.success(); }
                        },
                        error: function(model, xhr) {
                            if (options.error) { options.error(errorMessageCallback(xhr), xhr); }
                        }
                    });
                },

                _getLoginErrorMessage: function(xhr) {
                    if (xhr.status === httpstatus.UNAUTHORIZED) {
                        return 'Invalid username or password';
                    }
                    return 'An unknown error occurred';
                },

                _getRegistrationErrorMessage: function(xhr) {
                    return 'Registration failed.';
                }
            }))(savedSession);
        }());

        return Auth;
    });
}(window));
