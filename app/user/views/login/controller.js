app.controller('UserLoginCtrl', function($scope, $parse, $modal, Auth) {

    var user = {
        email: null,
        password: null
    };
    var form = {};

    function errorCallback(e) {
        switch(e.code) {
            case 'INVALID_USER'    : form.error = 'Такого пользователя не существует'; break;
            case 'INVALID_PASSWORD': form.error = 'Неверный пароль'; break;
            default:                 form.error = 'Ошибка входа';
        }
    }

    $scope.user = user;
    $scope.form = form;

    $scope.login = function(success) {
        Auth.$login('password', {
            email: user.email,
            password: user.password,
            rememberMe: true
        }).then(function() {
            if (success) {
                $parse(success)($scope);
            }
        }, errorCallback);
    }

    $scope.loginPopup = function(success) {
        $modal.open({
            templateUrl: 'app/user/views/login/templatePopup.html',
            controller: function($scope, $modalInstance) {
                $scope.user = user;
                $scope.form = form;
                $scope.login = function() {
                    Auth.$login('password', {
                        email: user.email,
                        password: user.password,
                        rememberMe: true
                    }).then(function() {
                        $modalInstance.close();
                        if (success) {
                            $parse(success)($scope);
                        }
                    }, errorCallback);
                }
                $scope.close = $modalInstance.close;
                $scope.cancel = $modalInstance.dismiss;
            }
        });
    }
});