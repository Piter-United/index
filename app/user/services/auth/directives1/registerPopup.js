'use strict';

/**
 * Show only for defined user or user group
 *
 * `pu-register-popup` - `{function}` - Succes register callback
 */
app.directive('puRegisterPopup', function(Auth) {
    return {
        controller: 'AuthCtrl',
        link: function (scope, elem, attr, ctrl) {

            elem.on('click', ctrl.registerPopup.bind(null, attr.puLoginPopup))
        }
    };
});