(function(window) {

    define([ 'backbone' ], function(Backbone) {
        var UserModel = Backbone.Model.extend({
            url: function() {
                var url = '/api/users';
                if (this.get('id')) {
                    url += '/' + this.get('id');
                }
                return url;
            },

            parse: function(response) {
                if (response && response.length > 0) {
                    return response[0];
                }
                return response;
            }
        });

        return {
            UserModel: UserModel
        };
    });

}(window));