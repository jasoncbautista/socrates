(function(window) {

    define([ 'mvc/item-view', 'app', 'flash', 'user' ], function(ItemView, App, Flash, User) {

        var display = function(userId) {
            var model = new User.UserModel({ id: userId });
            model.fetch({
                success: function() {
                    document.title = "Sqor | "+ model.attributes.first_name + " " + model.attributes.last_name +"'s Profile";

                    var view = new UserProfileView({ model: model });
                    App.mainContent.show(view);
                },
                error: function() {
                    Flash.error('Sorry, we could not display this user');
                }
            });
        };

        var UserProfileView = ItemView.extend({
            templateName: 'user-profile'
        });

        return {
            display: display
        };
    });
}(window));
