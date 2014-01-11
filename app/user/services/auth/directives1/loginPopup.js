'use strict';

/**
 * Login
 *
 * `pu-login-popup` - `{function}` - Success login callback
 */
app.directive('puLoginPopup', function(Auth) {

    return {
        controller: 'AuthCtrl',
        link: function (scope, elem, attr, ctrl) {

            elem.on('click', ctrl.loginPopup.bind(null, attr.puLoginPopup));
        }
    };
});