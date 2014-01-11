'use strict';

/**
 * Show only for defined user or user group
 *
 * `pu-logout` - `{}` - Logout
 */
app.directive('puLogout', function(Auth) {

    return function (scope, elem) {
        elem.on('click', Auth.$logout)
    };
});