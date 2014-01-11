'use strict';

/**
 * Show only for defined user or user group
 *
 * `pu-login-auth` - `{string/array/number}` - Display element if user has acceptable status or id.
 *  F.e. `pu-access=['admin','@item.owner', '@15']"` or `"'admin'"`or `"15"`)
 *  If status is starting `!`it means that all users exept it can access
 *  If status is starting `@`it means that it user id or user id expression
 */
app.directive('puAuthPopup', function($animate, $parse, Auth) {

    return {
        controller: 'AuthCtrl',
        link: function (scope, elem, attr, ctrl) {
            elem.on('click', ctrl.authPopup.bind(null, attr.puAuthPopup));
        }
    };
});