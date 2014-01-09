app.controller('UserRegisterCtrl', function($scope, $parse, $modal, Auth) {

    var newUser = {
        status: "registered",
        provider: "password",
        email: null,
        password: null,
        profile: {
            avatar: 'app/user/img/no_avatar_F.gif'
        }
    };
    var form = {};

    function errorCallback(e) {
        switch(e.code) {
            case 'EMAIL_TAKEN': form.error = 'Такой адрес уже используется'; break;
            default:            form.error = 'Ошибка регистрации';
        }
    }

    $scope.newUser = newUser;
    $scope.form = form;

    $scope.register = function(success) {
        //Регистрируемся и сразу логинимся
        Auth.$registerUser(newUser).then(function() {
            if (success) {
                $parse(success)($scope);
            }
        }, errorCallback);
    };
    $scope.registerAndStay = function(success) {
        //Регистрируемся и остаемся под старым пользователем
        Auth.$registerUser(newUser, true).then(function() {
            if (success) {
                $parse(success)($scope);
            }
        }, errorCallback);
    };
    $scope.unregister = Auth.$unregisterUser;

    $scope.registerPopup = function() {
        $modal.open({
            templateUrl: 'app/user/views/register/templatePopup.html',
            controller: function($scope, $modalInstance) {
                $scope.newUser = newUser;
                $scope.form = form;
                $scope.register = function(success) {
                    //Регистрируемся и сразу логинимся
                    Auth.$registerUser(newUser).then(function() {
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