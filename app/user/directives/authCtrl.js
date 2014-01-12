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
    }

    function authErrorLogin(error) {
        switch(error.code) {
            case 'INVALID_USER'     : this.loginMsg.error = 'Такого пользователя не существует'; break;
            case 'INVALID_PASSWORD' : this.loginMsg.error = 'Неверный пароль'; break;
            default                 : this.loginMsg.error = 'Ошибка входа';
        }
    }

    function loginEmail(callback, modal) {
        var form = this;

        Auth.$login('password', form.user)
            .then(authSuccess.bind(form, callback, modal))
            .catch(authErrorLogin.bind(form));
    }

    function loginFacebook(callback, modal) {
        var form = this;

        Auth.$login('facebook', {rememberMe: true, scope: 'email,user_likes'})
            .then(authSuccess.bind(form, callback, modal))
            .catch(authErrorLogin.bind(form));
    }

    function loginTwitter(callback, modal) {
        var form = this;

        Auth.$login('twitter', {rememberMe: true})
            .then(authSuccess.bind(form, callback, modal))
            .catch(authErrorLogin.bind(form));
    }

    function loginGithub(callback, modal) {
        var form = this;

        Auth.$login('github', {rememberMe: true, scope: 'user,gist'})
            .then(authSuccess.bind(form, callback, modal))
            .catch(authErrorLogin.bind(form));
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
    this.login         = loginEmail.bind(form);
    this.loginFacebook = loginFacebook.bind(form);
    this.loginTwitter  = loginTwitter.bind(form);
    this.loginGithub   = loginGithub.bind(form);

    this.loginPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/directives/loginPopup/template.html',
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
            templateUrl: 'app/user/directives/registerPopup/template.html',
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
            templateUrl: 'app/user/directives/authPopup/template.html',
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
                $scope.login         = loginEmail.bind(form, callback, $modalInstance);
                $scope.loginFacebook = loginFacebook.bind(form, callback, $modalInstance);
                $scope.loginTwitter  = loginTwitter.bind(form, callback, $modalInstance);
                $scope.loginGithub   = loginGithub.bind(form, callback, $modalInstance);
                $scope.register = registerUser.bind(form, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };
});