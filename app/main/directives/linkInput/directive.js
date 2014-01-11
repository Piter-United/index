'use strict';

/**
 * Link editor
 *
 * `pu-link-input` - `{model}` - Model link (f.e. `pu-link-input="model.link"`)
 *
 * `pu-link-input-save` - `{function}` - run when editor closes (f.e. `pu-link-input-save="save()"`)
 */
app.directive('puLinkInput', function($parse) {

    function camelCaseToHyphens(token) {
        return token.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase()
    }
    return {
        templateUrl: 'app/main/directives/linkInput/template.html',
        scope: true,
        replace: true,
        compile: function(tElem, tAttrs) {

            var children = tElem.children();

            angular.forEach(tAttrs, function(v, k) {
                if (k !== 'puLinkInput' && k !== 'puLinkInputSave') {
                    tElem[0].removeAttribute(camelCaseToHyphens(k));
                }
            })
            tElem.addClass('input-group');

            children.eq(0)[0].setAttribute('type', tAttrs.type);
            children.eq(0)[0].setAttribute('placeholder', tAttrs.placeholder);
            children.eq(0)[0].setAttribute('ng-model', tAttrs.ngModel);
            children.eq(1)[0].setAttribute('ng-model', tAttrs.puLinkInput);

            return function(scope, element, attrs) {
                scope.i = {
                    pristine: true
                };
                scope.editor = false;
                scope.edit = function(){
                    if (attrs.puLinkInputSave && scope.editor) {
                        $parse(attrs.puLinkInputSave)(scope);
                    }
                    scope.editor = !scope.editor;
                }
            }
        }
    }
});

app.directive('puLinkInputEditor', function() {
    return {
        require: "ngModel",
        link: function(scope, element, attrs, ngModel) {

            scope.$watch(attrs.ngModel, function (newVal, oldVal) {

                if (ngModel.$viewValue === undefined) {
                    ngModel.$setViewValue('');
                    ngModel.$setPristine();
                }
                scope.i.pristine = ngModel.$pristine;
                scope.i.valid    = ngModel.$pristine ? false : ngModel.$valid;
                scope.i.invalid  = ngModel.$pristine ? false : ngModel.$invalid;
            })
        }
    }
});
