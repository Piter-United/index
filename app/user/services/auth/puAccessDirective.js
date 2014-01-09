'use strict';

/**
 * Show only for defined user or user group
 *
 * `pu-access` - `{string/array/number}` - Display element if user has acceptable status or id.
 *  F.e. `pu-access=['admin','@item.owner', '@15']"` or `"'admin'"`or `"15"`)
 *  If status is starting `!`it means that all users exept it can access
 *  If status is starting `@`it means that it user id or user id expression
 */
//ngIf copy
app.directive('puAccess', function($animate, $parse, Auth) {

    /**
     * Return the DOM siblings between the first and last node in the given array.
     * @param {Array} array like object
     * @returns jQlite object containing the elements
     */
    function getBlockElements(nodes) {
        var startNode = nodes[0],
            endNode = nodes[nodes.length - 1];
        if (startNode === endNode) {
            return jqLite(startNode);
        }

        var element = startNode;
        var elements = [element];

        do {
            element = element.nextSibling;
            if (!element) break;
            elements.push(element);
        } while (element !== endNode);

        return angular.element(elements);
    }
    return {
        transclude: 'element',
        priority: 700,
        terminal: true,
        restrict: 'A',
        $$tlb: true,
        link: function ($scope, $element, $attr, ctrl, $transclude) {
            var i, block, childScope, userGroup, userId, unwatcher, unwatchers = [];

            $scope.$watch($attr.puAccess, function(value) {
                for (i = 0; i < unwatchers.length; i++) {
                    unwatchers.pop()();
                }
                checkPermision(parseUserId(value));
            });
            $scope.$watch(function() {return Auth.$current.user.status;}, function() {
                checkPermision(parseUserId($parse($attr.puAccess)($scope)))
            });

            function parseUserId(value) {
                userGroup = angular.isArray(value) ? value : [value];

                for (i = 0; i < userGroup.length; i++) {
                    if (typeof userGroup[i] === 'string') {
                        if (userGroup[i].charAt(0) === '@') {
                            userId = userGroup[i].substring(1)
                            if (isNaN(Number(userId))) {
                                userGroup[i] = '@' + $parse(userId)($scope);;
                                unwatcher = $scope.$watch(userId, function(newVal, oldVal) {
                                    if (newVal !== oldVal) {
                                        checkPermision(parseUserId($parse($attr.puAccess)($scope)))
                                    }
                                });
                                unwatchers.push(unwatcher);
                            }
                            userGroup[i] = isNaN(Number(userId)) ? '@' + $parse(userId)($scope) : userGroup[i]
                        }
                    }
                }
                return userGroup;
            }

            function checkPermision(value) {
                if (Auth.$isAllow(value)) {
                    if (!childScope) {
                        childScope = $scope.$new();
                        $transclude(childScope, function (clone) {
                            clone[clone.length++] = document.createComment(' end puAccess: ' + $attr.puAccess + ' ');
                            // Note: We only need the first/last node of the cloned nodes.
                            // However, we need to keep the reference to the jqlite wrapper as it might be changed later
                            // by a directive with templateUrl when it's template arrives.
                            block = {
                                clone: clone
                            };
                            $animate.enter(clone, $element.parent(), $element);
                        });
                    }
                } else {

                    if (childScope) {
                        childScope.$destroy();
                        childScope = null;
                    }

                    if (block) {
                        $animate.leave(getBlockElements(block.clone));
                        block = null;
                    }
                }
            }
        }
    };
});