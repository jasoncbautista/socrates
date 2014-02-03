(function(window) {
    'use strict';

    define(['facebook', 'auth/auth', 'config'], function(FB, Auth, config) {

        var host = window.location.host;
        if (window.location.port && window.location.port.length > 0) {
            host += ':' + window.location.port;
        }

        FB.init({
            appId      : config.facebookAppId, // App ID
            channelUrl : '//' + host + '/channel.html', // Channel File
            status     : true, // check login status
            cookie     : true, // enable cookies to allow the server to access the session
            xfbml      : false // parse XFBML
        });


        var loginOrRegister = function(options) {
            FB.getLoginStatus(function(loginResponse) {
                if (loginResponse.status === 'connected') {
                    tryToAuthOrRegister(loginResponse, options);
                } else {
                    FB.login(function(loginResponse) {
                        if (loginResponse.status === 'connected') {
                            tryToAuthOrRegister(loginResponse, options);
                        }
                    }, {
                        scope: 'email'
                    });
                }
            });
        };


        var tryToAuthOrRegister = function(loginResponse, options) {
            tryToAuth(loginResponse, {
                success: options.success,
                error: function(message, xhr) {
                    // TODO: xhr.status should be inspected to see if an auth error is
                    //       returned (401 Unauthorized). Unfortunately, the REST server
                    //       is returning a 500 error at this time.
                    tryToRegister(loginResponse, options);
                }
            });
        };

        var tryToAuth = function(loginResponse, options) {
            var data = {
                'provider': 'facebook',
                'provider_user_id': loginResponse.authResponse.userID,
                'secret': loginResponse.authResponse.accessToken
            };

            Auth.login(data, options);
        };

        var tryToRegister = function(loginResponse, options) {
            FB.api('/me', function(meResponse) {
                var data = {
                    'provider': 'facebook',
                    'provider_user_id': loginResponse.authResponse.userID,
                    'secret': loginResponse.authResponse.accessToken,

                    'email': meResponse.email,
                    'firstname': meResponse.first_name || '',
                    'lastname': meResponse.last_name || '',
                    'birthdate': meResponse.birthday || '',
                    'gender': meResponse.gender || '',
                    'location': meResponse.location && meResponse.location.name || '',
                    'avatar': meResponse.picture && !meResponse.picture.is_silhouette && meResponse.picture.url || ''
                };

                Auth.register(data, options);
            });
        };

        var slice = function(args) {
            return Array.prototype.slice.apply(args);
        };

        return {
            loginOrRegister: loginOrRegister
        };
    });

}(window));