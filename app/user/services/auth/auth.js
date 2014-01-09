/**
 * Registration and authorization
 *
 *  **Properties**
 *
 * - `$current` – `{Object}` – user object
 *  example
 *  {
 *    status: registered/moderator/admin/deleted,
 *    date: registerDate,
 *    provider: {
 *      password/facebook/etc.: {
 *        email: loginEmail,
 *        password: password
 *    },
 *    password: password,
 *    profile: {
 *      nick: nickname
 *      email: profileEmail
 *      ...
 *    }
 *  }
 *
 * - `$authorizing` - `{Promise}` - resolved if user guest or successful login
 *
 * **Methods**
 *
 * - `$login(token, options)` – fireAngular `$login` + try login from cookies if params undefined
 *
 * - `$logout()` – see fireAngular `$logout`
 *
 * - `$registerUser(newUser, login)` – register new user from object `newUser`.
 *  If `login` is true new user will be login after registration
 *
 * - `$unregisterUser(id)` – set user status `deleted`
 *
 * - `$routeAllow(path, status, next, current)` – allow set `path` for user with `status`.
 *  You can set several status, f.e. "admin moderator".
 *  `next`, `current` — params from `$routeChangeStart` event of ngRouter
 */

app.factory('Auth', function($q, $cookies, $location, $firebaseAuth, User) {
    var authRef = new Firebase("https://piterunited.firebaseio.com");
    var auth = $firebaseAuth(authRef);
    var guest = {
        status: "guest",
        profile: {}
    }
    var authLogin = auth.$login;
    var authLogout = auth.$logout;

    auth.$current = {
        user: angular.copy(guest)
    }
    auth.$authorizing = $q.when('guest');

    auth.$login = function(token, options) {
        var deferred = $q.defer(),
            authPromise = auth.$authorizing = deferred.promise;

        function setUser (user) {
            var userData = User.get({id: user.id});
            userData.$on('change', function() {
                if (userData.status) {
                    auth.$current.user = userData;
                    userData.$on('change', function() {
                        deferred.resolve(user);
                    })
                }
            });
        }

        if (!token || !options) {
            if ($cookies.auth) {

                authRef.auth($cookies.auth, function(error, user) {
                    if(!error) {
                        setUser(user.auth);

                    } else {
                        console.log("Login Failed!", error);
                        deferred.reject(error);
                    }
                });
            }
        } else {
            authLogin(token, options).then(function(user) {
                $cookies.auth = user.firebaseAuthToken;
                setUser(user);

            }, function(error) {
                console.error('Login failed: ', error);
                deferred.reject(error);
            });
        }
        return authPromise;
    }
    auth.$logout = function() {
        $cookies.auth = "";
        auth.$current.user = angular.copy(guest);
        authLogout();
    }
    auth.$registerUser = function(newUser, stay) {
        var deferred = $q.defer();

        if (newUser.provider === "password" && newUser.email && newUser.password) {

            auth.$createUser(newUser.email, newUser.password, function(error, user) {
                if (!error) {
                    var password = newUser.password;

                    var date = new Date();
                    newUser.date = date.getTime();
                    newUser.id = user.id;

                    if(!newUser.status) newUser.status = "registered";

                    if (!newUser.profile) newUser.profile = {};
                    //Minimum one property needs to be in profile
                    newUser.profile.name = newUser.profile.nick = newUser.profile.email = newUser.scope = user.email;

                    delete newUser.email;
                    delete newUser.password;

                    User.addByKey(user.id, newUser);

                    if (stay) {
                        //TODO: stay old use in firebase auth
                        //auth.$login();
                        deferred.resolve(user);
                    } else {
                        auth.$login("password", {
                            email: newUser.scope,
                            password: password,
                            rememberMe: true
                        }).then(deferred.resolve, deferred.reject)
                    }
                } else {
                    deferred.reject(error);
                    console.log('Ошибка регистрации');
                }
            });
        }
        return deferred.promise;
    }
    auth.$unregisterUser = function(id){
        id = id ? id : auth.$current.user.id;
        User.get({id: id}).$child("status").$set("deleted");
    }
    auth.$isAllow = function(value) {
        var userGroup, userId,
            access = false;

        if (angular.isArray(value)) {
            userGroup = value;
        } else if (isNaN(Number(value))) {
            userGroup = [value]
        } else {
            userId = value;
        }

        if (userGroup) {
            for (var i = 0; i < userGroup.length; i++) {
                if (typeof userGroup[i] === 'string') {

                    if (userGroup[i].charAt(0) === '!') {
                        access = true;
                        if (auth.$current.user.status === userGroup[i].substring(1)) {
                            access = false;
                            break;
                        }
                    } else if (userGroup[i].charAt(0) === '@' && userGroup[i].substring(1) == auth.$current.user.id) {
                        return true;
                    } else if (auth.$current.user.status === userGroup[i]) {
                        return true;
                    }
                }
            }
        }
        if (userId && userId == auth.$current.user.id) {
            return true;
        }
        return access;
    };
    auth.$routeAllow = function(path, status, next, current) {
        if (next.originalPath === path) {
             auth.$authorizing.then(function(){
                if (auth.$isAllow(status)) {
                    $location.path(next.originalPath);
                }
            });
            //TODO: fix bug when current.originalPath contains parameters
            $location.path(current && current.originalPath && current.originalPath !== next.originalPath ? current.originalPath : "/");
        }
    };
    return auth;
})