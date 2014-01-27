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
 * - `$registerUser(newUser, stay)` – register new user from object `newUser`.
 *  If `stay` is undefined new user will be login after registration
 *
 * - `$unregisterUser(id)` – set user status `deleted`
 *
 * - `$routeAllow(path, status, next, current)` – allow set `path` for user with `status`.
 *  You can set several status, f.e. "admin moderator".
 *  `next`, `current` — params from `$routeChangeStart` event of ngRouter
 */

app.factory('Auth', function($q, $cookies, $location, $firebaseSimpleLogin, User) {
    var authRef = new Firebase("https://piterunited.firebaseio.com");
    var auth = $firebaseSimpleLogin(authRef);
    var guest = {
        status: "guest",
        profile: {}
    };
    var authLogin = auth.$login;
    var authLogout = auth.$logout;

    function setUser(user, deferred) {
        var userData = User.get({id: user.uid});

        userData.$on('change', function() {
            if (userData.status) {
                auth.$current.user = userData;
                deferred.resolve(user);
            }
        });
    }

    auth.$current = {
        user: angular.copy(guest)
    };
    auth.$authorizing = $q.when('guest');

    auth.$login = function(token, options) {
        var deferred = $q.defer(),
            authPromise = auth.$authorizing = deferred.promise;

        if (!token || !options) {
            if ($cookies.auth) {
                authRef.auth($cookies.auth, function(error, user) {
                    if(!error) {
                        setUser(user.auth, deferred);
                    } else {
                        console.log("Login Failed!", error);
                        auth.$logout();
                        deferred.reject(error);
                    }
                });
            }
        } else {
            authLogin(token, options)
                .then(function(user) {
                    User.isset(user.uid)
                        .then(function() {
                            $cookies.auth = user.firebaseAuthToken;
                            setUser(user, deferred);
                        })
                        .catch(function(){
                            auth.$registerUser(user, false, deferred);
                        });
                })
                .catch(function(error) {
                    console.error('Login failed: ', error);
                    deferred.reject(error);
                });
        }
        return authPromise;
    };
    auth.$logout = function() {
        $cookies.auth = "";
        auth.$current.user = angular.copy(guest);
        authLogout();
    };
    auth.$registerUser = function(newUser, stay, loginDeferred) {
        var deferred = $q.defer();

        if (newUser.provider === undefined && newUser.email && newUser.password) {

            auth.$createUser(newUser.email, newUser.password, function(error, user) {
                if (!error) {
                    var password = newUser.password;

                    var date = new Date();
                    newUser.date = date.getTime();
                    newUser.id = user.uid;

                    if(!newUser.status) newUser.status = "registered";

                    if (!newUser.profile) newUser.profile = {};
                    //Minimum one property needs to be in profile
                    newUser.profile.name = newUser.profile.nick = newUser.profile.email = newUser.scope = user.email;

                    delete newUser.email;
                    delete newUser.password;

                    User.addByKey(user.uid, newUser);
                    if (stay) {
                        //TODO: stay old user in firebase auth
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
        if (newUser.provider === "twitter" && newUser.username) {
            var user = newUser;
            var date = new Date();
            newUser = {
                date: date.getTime(),
                id: user.uid,
                status: "registered",
                scope: user,
                profile: {
                    name: newUser.username,
                    nick: newUser.username,
                    avatar: newUser.profile_image_url,
                    url: 'https://twitter.com/' + newUser.username
                }
            };
            User.addByKey(user.uid, newUser);
            setUser(user, loginDeferred);
        }
        return deferred.promise;
    };
    auth.$unregisterUser = function(id){
        id = id ? id : auth.$current.user.id;
        User.get({id: id}).$child("status").$set("deleted");
    };
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
});