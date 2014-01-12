app.controller('AuthCtrl', function($scope, $parse, $modal, Auth) {

    var defaults = {
        user: {
            status: "registered",
            email: null,
            password: null,
            rememberMe: true,
            profile: {
                avatar: 'app/user/img/no_avatar_F.gif'
            }
        },
        loginMsg: {},
        registerMsg: {}
    };
    var settings = {
        facebook: {provider: 'facebook', options: {rememberMe: true, scope: 'email,user_likes'}},
        twitter:  {provider: 'twitter',  options: {rememberMe: true}},
        github:   {provider: 'github',   options: {rememberMe: true, scope: 'user,gist'}}
    };
    var form = angular.copy(defaults);

    function authSuccess(callback, modal) {
        angular.extend(this, angular.copy(defaults));

        if (modal) {
            modal.close();
        }
        if (callback) {
            $parse(callback)($scope);
        }
    }

    function loginUser(params, callback, modal) {
        var form = this;

        Auth.$login(params.provider, params.options)
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

        Auth.$registerUser(form.user, stay)
            .then(authSuccess.bind(form, callback, modal))
            .catch(function(error) {
                switch(error.code) {
                    case 'EMAIL_TAKEN'      : form.registerMsg.error = 'Такой адрес уже используется'; break;
                    default                 : form.registerMsg.error = 'Ошибка регистрации';
                }
            });
    }


    //Login
    this.login         = loginUser.bind(form, {provider: 'password', options: form.user});
    this.loginFacebook = loginUser.bind(form, settings.facebook);
    this.loginTwitter  = loginUser.bind(form, settings.twitter);
    this.loginGithub   = loginUser.bind(form, settings.github);

    this.loginPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/directives/loginPopup/template.html',
            controller: function($scope, $modalInstance) {
                var form = angular.copy(defaults);
                angular.extend($scope, form);

                $scope.login = loginUser.bind(form, {provider: 'password', options: form.user}, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };
    this.logout = Auth.$logout;


    //Register
    this.register = registerUser.bind(form, false);

    this.registerAndStay = registerUser.bind(form, true); //Регистрируемся и остаемся под старым пользователем

    this.registerPopup = function(callback) {
        $modal.open({
            templateUrl: 'app/user/directives/registerPopup/template.html',
            controller: function($scope, $modalInstance) {
                var form = angular.copy(defaults);
                angular.extend($scope, form);

                $scope.register = registerUser.bind(form, false, callback, $modalInstance);
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
                $scope.login         = loginUser.bind(form, {provider: 'password', options: form.user}, callback, $modalInstance);
                $scope.loginFacebook = loginUser.bind(form, settings.facebook, callback, $modalInstance);
                $scope.loginTwitter  = loginUser.bind(form, settings.twitter, callback, $modalInstance);
                $scope.loginGithub   = loginUser.bind(form, settings.github, callback, $modalInstance);
                $scope.register = registerUser.bind(form, false, callback, $modalInstance);
                $scope.close = $modalInstance.close;
            }
        });
    };

    //Scope params
    angular.extend($scope, form, this);
});