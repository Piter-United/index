'use strict';

/**
 * Do something after auth
 *
 * `pu-after-auth` - `{expression}` - Expression which do after authorization
 */
app.directive('puAfterAuth', function() {
    return {
        templateUrl: 'app/user/directives/afterAuth/template.html',
        controller: 'AuthCtrl',
        link: function (scope, elem, attr, ctrl) {
            scope.afterAuthAction        = attr.puAfterAuth;
            scope.afterAuthLoginTitle    = attr.loginTitle;
            scope.afterAuthRegisterTitle = attr.registerTitle;
        }
    };
});