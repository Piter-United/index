'use strict';

/**
 * Return data as array
 */
app.factory('$firebaseArr', ['$firebase', '$filter', function($firebase, $filter) {
    return function(ref) {
        var dataObj = $firebase(ref);
        var dataArr = angular.extend([], dataObj);

        dataObj.$on('change', function() {
            dataArr.length = 0;
            angular.extend(dataArr, $filter('orderByPriority')(dataObj));
        });
        return dataArr;
    }
}]);

/**
 * Simple FireBase factory
 */
app.factory('$firebaseRes', ['$q', '$firebase', '$firebaseArr', function ($q, $firebase, $firebaseArr) {

    //--Copy from Angular Resource
    var noop = angular.noop,
        forEach = angular.forEach,
        extend = angular.extend,
        copy = angular.copy,
        isFunction = angular.isFunction;

    /**
     * We need our custom method because encodeURIComponent is too aggressive and doesn't follow
     * http://www.ietf.org/rfc/rfc3986.txt with regards to the character set (pchar) allowed in path
     * segments:
     *    segment       = *pchar
     *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
     *    pct-encoded   = "%" HEXDIG HEXDIG
     *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
     *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
     *                     / "*" / "+" / "," / ";" / "="
     */
    function encodeUriSegment(val) {
        return encodeUriQuery(val, true).
            replace(/%26/gi, '&').
            replace(/%3D/gi, '=').
            replace(/%2B/gi, '+');
    }


    /**
     * This method is intended for encoding *key* or *value* parts of query component. We need a
     * custom method because encodeURIComponent is too aggressive and encodes stuff that doesn't
     * have to be encoded per http://tools.ietf.org/html/rfc3986:
     *    query       = *( pchar / "/" / "?" )
     *    pchar         = unreserved / pct-encoded / sub-delims / ":" / "@"
     *    unreserved    = ALPHA / DIGIT / "-" / "." / "_" / "~"
     *    pct-encoded   = "%" HEXDIG HEXDIG
     *    sub-delims    = "!" / "$" / "&" / "'" / "(" / ")"
     *                     / "*" / "+" / "," / ";" / "="
     */
    function encodeUriQuery(val, pctEncodeSpaces) {
        return encodeURIComponent(val).
            replace(/%40/gi, '@').
            replace(/%3A/gi, ':').
            replace(/%24/g, '$').
            replace(/%2C/gi, ',').
            replace(/%20/g, (pctEncodeSpaces ? '%20' : '+'));
    }

    function Route(template, defaults) {
        this.template = template;
        this.defaults = defaults || {};
        this.urlParams = {};
    }

    Route.prototype = {
        setUrlParams: function (config, params, actionUrl) {
            var self = this,
                url = actionUrl || self.template,
                val,
                encodedVal;

            var urlParams = self.urlParams = {};
                forEach(url.split(/\W/), function(param){
                    if (param === 'hasOwnProperty') {
                        throw $resourceMinErr('badname', "hasOwnProperty is not a valid parameter name.");
                    }
                    if (!(new RegExp("^\\d+$").test(param)) && param &&
                        (new RegExp("(^|[^\\\\]):" + param + "(\\W|$)").test(url))) {
                        urlParams[param] = true;
                    }
                });
                url = url.replace(/\\:/g, ':');

                params = params || {};
                forEach(self.urlParams, function(_, urlParam){
                    val = params.hasOwnProperty(urlParam) ? params[urlParam] : self.defaults[urlParam];
                    if (angular.isDefined(val) && val !== null) {
                        encodedVal = encodeUriSegment(val);
                        url = url.replace(new RegExp(":" + urlParam + "(\\W|$)", "g"), encodedVal + "$1");
                    } else {
                        url = url.replace(new RegExp("(\/?):" + urlParam + "(\\W|$)", "g"), function(match,
                                                                                                     leadingSlashes, tail) {
                            if (tail.charAt(0) == '/') {
                                return tail;
                            } else {
                                return leadingSlashes + tail;
                            }
                        });
                    }
                });

                // strip trailing slashes and set the url
                url = url.replace(/\/+$/, '') || '/';
                // then replace collapse `/.` if found in the last URL path segment before the query
                // E.g. `http://url.com/id./format?q=x` becomes `http://url.com/id.format?q=x`
                url = url.replace(/\/\.(?=\w+($|\?))/, '.');
                // replace escaped `/\.` with `/.`
                config.url = url.replace(/\/\\\./, '/.');


                // set params - delegate param encoding to $http
                forEach(params, function(value, key){
                    if (!self.urlParams[key]) {
                        config.params = config.params || {};
                        config.params[key] = value;
                    }
                });
            }
        };
        //--

        function resourceFactory(urlDefaults, paramDefaults) {
            var route = new Route(urlDefaults);

            function newFirebase(a1, a2) {

                var url = typeof a1 === 'string' ? a1 : urlDefaults,
                    params = typeof a1 === 'object' ? a1 : a2,
                    config = {};
                route.setUrlParams(config, angular.extend({}, paramDefaults, params), url);
                return  new Firebase(config.url);
            }
            return {
                'get': function(url, params) {

                    var ref = newFirebase(url, params);
                    return $firebase(ref);
                },
                'query': function(url, params) {

                    var ref = newFirebase(url, params);
                    return $firebaseArr(ref);
                },
                'add': function(value, url, params) {

                    var ref = newFirebase(url, params);
                    return ref.push(value).name();
                },
                'addWithId': function(value, key) {

                    key = key ? key : 'id';
                    var ref = newFirebase(),
                        itemRef = ref.push(value),
                        id = itemRef.name();
                    itemRef.child(key).set(id);
                    return id;
                },
                'addByKey': function(key, value, url, params) {

                    var ref = newFirebase(url, params);
                    ref.child(key).set(value);
                },
                'remove': function(url, params) {

                    var items = this.get(url, params);
                    items.$remove();
                },
                'isset': function(key, url, params) {

                    var ref = newFirebase(url, params),
                        deferred = $q.defer();

                    ref.child(key).once('value', function(snapshot) {
                        var value = snapshot.val();

                        value ? deferred.resolve(value) : deferred.reject();
                    });
                    return deferred.promise;
                },
                //for tests
                'ref': function(url, params) {
                    return newFirebase(url, params);
                }
//                //not works
//                'save': function(url, params) {
//
//                    var items = this.get(url, params);
//                    items.$save();
//                }
            };
        }
        return resourceFactory;
    }]);