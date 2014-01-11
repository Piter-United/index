app.controller('AuthCtrl', function($scope, $parse, $modal, Auth) {

    var defaults = {
        user: {
            status: "registered",
            provider: "password",
            email: undefined,
            password: undefined,
            rememberMe: true,
            profile: {
                avatar: 'app/user/img/no_avatar_F.gif'
            }
        },
        loginMsg: {},
        registerMsg: {}
    };
    var form = angular.copy(defaults);

    //Scope params
    angular.extend($scope, form);

    function authSuccess(callback, modal) {
        angular.extend(this, angular.copy(defaults));

        if (modal) {
            modal.close();
        }
        if (callback) {
            $parse(callback)($scope);
        }
    };

    function loginUser(callback, modal) {
        var form = this;

        Auth.$login('password', form.user)
            .then(authSuccess.bind(form, callback, modal))
            .catch(function(error) {
                switch(error.code) {
                    case 'INVALID_USER'     : form.loginMsg.error = 'Такого пользователя не существует'; break;
                    case 'INVALID_PASSWORD' : form.loginMsg.error = 'Неверный пароль'; break;
                    default                 : form.loginMsg.error = 'Ошибка входа';
                }
            });
    }

    function loginFacebook(callback, modal) {
        var form = this;
        form.user.provider = 'persona';

        Auth.$login('facebook', {rememberMe: true, scope: 'email,user_likes'})
            .then(authSuccess.bind(form, callback, modal))
            .catch(function(error) {
                switch(error.code) {
                    case 'INVALID_USER'     : form.loginMsg.error = 'Такого пользователя не существует'; break;
                    case 'INVALID_PASSWORD' : form.loginMsg.error = 'Неверный пароль'; break;
                    default                 : form.loginMsg.error = 'Ошибка входа';
                }
            });
    }

    function registerUser(stay, callback, modal) {
        var form = this;
        if (!stay) {
            modal = callback;
            callback = stay;
        }
        Auth.$registerUser(form.user, stay)
            .then(authSuccess.bind(form, callback, modal))
            .catch(function(error) {
                switch(error.code) {
                    case 'EMAIL_TAKEN'   : form.registerMsg.error = 'Такой адрес уже используется'; break;
                    default              : form.registerMsg.error = 'Ошибка регистрации';
                }
            });
    }



    //Login
    this.login = loginUser.bind(form);

    this.loginPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/views/login/templatePopup.html',
            controller: function($scope, $modalInstance) {
                var form = angular.copy(defaults);
                angular.extend($scope, form);

                $scope.login = loginUser.bind(form, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };
    this.logout = Auth.$logout;


    //Register
    this.register = registerUser.bind(form);

    this.registerAndStay = registerUser.bind(form, true); //Регистрируемся и остаемся под старым пользователем

    this.registerPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/views/register/templatePopup.html',
            controller: function($scope, $modalInstance) {
                var form = angular.copy(defaults);
                angular.extend($scope, form);

                $scope.register = registerUser.bind(form, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };
    this.unregister = Auth.$unregisterUser;

    //Auth (Login & Register)
    this.authPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/services/auth/puAuthPopup.html',
            controller: function($scope, $modalInstance) {
                var form = angular.copy(defaults);
                form.tab = {};
                angular.extend($scope, form);

                switch(callback) {
                    case 'register':
                        form.tab.login    = false;
                        form.tab.register = true;
                        break;
                    default:
                        form.tab.login    = true;
                        form.tab.register = false;
                }
                $scope.login = loginUser.bind(form, callback, $modalInstance);
                $scope.loginFacebook = loginFacebook.bind(form, callback, $modalInstance);
                $scope.register = registerUser.bind(form, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };
});