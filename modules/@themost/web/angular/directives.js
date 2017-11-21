'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.AngularServerModuleDefaults = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }(); /**
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * @license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * MOST Web Framework 2.0 Codename Blueshift
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *                     Anthi Oikonomou anthioikonomou@gmail.com
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      *
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * Use of this source code is governed by an BSD-3-Clause license that can be
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      * found in the LICENSE file at https://themost.io/license
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      */


require('source-map-support/register');

var _lodash = require('lodash');

var _ = _interopRequireDefault(_lodash).default;

var _permission = require('@themost/data/permission');

var DataPermissionEventListener = _permission.DataPermissionEventListener;

var _types = require('../../data/types');

var DataEventArgs = _types.DataEventArgs;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function toBoolean(value) {
    if (typeof value === 'function') {
        value = true;
    } else if (value && value.length !== 0) {
        var v = _.lowerCase("" + value);
        value = !(v === 'f' || v === '0' || v === 'false' || v === 'no' || v === 'n' || v === '[]');
    } else {
        value = false;
    }
    return value;
}
function getBlockElements(angular, nodes) {
    var startNode = nodes[0],
        endNode = nodes[nodes.length - 1];
    if (startNode === endNode) {
        return angular.element(startNode);
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

var AngularServerModuleDefaults = exports.AngularServerModuleDefaults = function () {
    function AngularServerModuleDefaults() {
        _classCallCheck(this, AngularServerModuleDefaults);
    }

    _createClass(AngularServerModuleDefaults, null, [{
        key: 'applyDirectives',

        /**
         * @param {AngularServerModule} module
         */
        value: function applyDirectives(module) {
            module.directive('serverInclude', function ($context, $async, $parse, $window) {
                return {
                    replace: true,
                    restrict: 'EA',
                    link: function link(scope, element, attrs) {
                        //get angular instance
                        var angular = $window.angular;
                        return $async(function (resolve, reject) {
                            /**
                             * @ngdoc attrs
                             * @property {string} serverInclude
                             * @property {string} src
                             */
                            var src = $parse(attrs.serverInclude)(scope);
                            if (src) {
                                $context.getApplication().executeRequest({
                                    url: src,
                                    cookie: $context.request.headers.cookie
                                }).then(function (result) {
                                    element.removeAttr('data-src');
                                    element.replaceWith(angular.element(result.body.replace(/\n/, '')));
                                    resolve();
                                }).catch(function (err) {
                                    element.replaceWith(null);
                                    reject(err.message);
                                });
                            }
                        });
                    }
                };
            }).directive('serverInit', function () {
                return {
                    priority: 400,
                    restrict: 'A',
                    link: function link(scope, element, attrs) {
                        /**
                         * @ngdoc attrs
                         * @property {string} serverInit
                         */
                        scope.$eval(attrs.serverInit);
                    }
                };
            }).directive('serverIf', function ($animate, $window, $document) {
                return {
                    transclude: 'element',
                    priority: 600,
                    terminal: true,
                    restrict: 'A',
                    $$tlb: true,
                    link: function link($scope, $element, $attr, ctrl, $transclude) {
                        var block = void 0,
                            childScope = void 0,
                            previousElements = void 0;
                        var serverIf = $attr['serverIf'],
                            parentDocument = $document.get(0);
                        $scope.$watch(serverIf, function ngIfWatchAction(value) {
                            if (toBoolean(value)) {
                                if (!childScope) {
                                    childScope = $scope.$new(false);
                                    $transclude(childScope, function (clone) {
                                        clone.push(parentDocument.createComment(''));
                                        //clone[clone.length++] = parentDocument.createComment('');
                                        block = {
                                            clone: clone
                                        };
                                        $animate.enter(clone, $element.parent(), $element);
                                    });
                                }
                            } else {
                                if (previousElements) {
                                    previousElements.remove();
                                    previousElements = null;
                                }
                                if (childScope) {
                                    childScope.$destroy();
                                    childScope = null;
                                }
                                if (block) {
                                    previousElements = getBlockElements($window.angular, block.clone);
                                    $animate.leave(previousElements, function () {
                                        previousElements = null;
                                    });
                                    block = null;
                                }
                            }
                        });
                    }
                };
            }).directive('serverIfPermission', ['$context', '$compile', '$async', function ($context, $compile, $async) {
                return {
                    restrict: 'E',
                    replace: true,
                    scope: { model: '@', mask: '@', state: '@' },
                    compile: function compile() {
                        return {
                            pre: function preLink(scope, element) {
                                return $async(function (resolve, reject) {
                                    try {
                                        var targetModel = $context.model(scope.model);
                                        if (_.isNil(scope.state)) {
                                            if (scope.mask) if (scope.mask === 1) scope.state = 0;else if (scope.mask === 2) scope.state = 1;else if (scope.mask === 4) scope.state = 2;else if (scope.mask === 8) scope.state = 4;else scope.state = scope.mask;
                                        }
                                        var p = new DataPermissionEventListener();
                                        var event = _.assign(new DataEventArgs(), {
                                            model: targetModel,
                                            state: scope.state,
                                            throwError: false
                                        });
                                        p.validate(event, function () {
                                            if (event.result) {
                                                var result = $compile(element.contents())(scope);
                                                element.replaceWith(result);
                                                resolve();
                                            } else {
                                                element.replaceWith(null);
                                                resolve();
                                            }
                                        });
                                    } catch (err) {
                                        reject(err.message);
                                    }
                                });
                            },
                            post: function post() {
                                //
                            }
                        };
                    }
                };
            }]).directive('serverLoc', ['$context', function ($context) {
                return {
                    restrict: 'A',
                    link: function link(scope, element, attrs) {
                        /**
                         * @ngdoc
                         * @name attrs
                         * @property {string} serverLoc
                         * @private
                         */
                        if (attrs.title) element.attr('title', $context.translate(attrs.title, attrs.serverLoc));
                        if (attrs.placeholder) element.attr('placeholder', $context.translate(attrs.placeholder, attrs.serverLoc));
                    }
                };
            }]).directive('serverLocHtml', ['$context', function ($context) {
                return {
                    restrict: 'A',
                    link: function link(scope, element, attrs) {
                        /**
                         * @ngdoc
                         * @name attrs
                         * @property {string} serverLocHtml
                         * @private
                         */
                        var text = $context.translate(element.html(), attrs.serverLocHtml);
                        if (text) element.html(text);
                    }
                };
            }]).directive('serverUserInRole', ['$context', '$compile', function ($context) {
                return {
                    restrict: 'A',
                    replace: true,
                    priority: 100,
                    compile: function compile() {
                        return {
                            pre: function preLink(scope, element, attrs) {
                                var user = $context.user;
                                if (typeof user !== 'undefined') {
                                    user.groups = user.groups || [];
                                    /**
                                     * @ngdoc attrs
                                     * @property {string} serverUserInRole
                                     *
                                     * @type {Array}
                                     * @private
                                     */
                                    var roles = (attrs.serverUserInRole || '').split(',');
                                    var inRole = typeof _.find(user.groups, function (x) {
                                        return roles.indexOf(x.name) >= 0;
                                    }) !== 'undefined';
                                    //validate not statement e.g. server-user-in-role='!Administrators'
                                    if (!inRole) {
                                        _.forEach(roles, function (x) {
                                            if (!inRole) {
                                                if (x.indexOf('!') === 0) {
                                                    inRole = typeof _.find(user.groups, function (y) {
                                                        return x.substr(1).indexOf(y.name) >= 0;
                                                    }) !== 'undefined';
                                                }
                                            }
                                        });
                                    }
                                    if (!inRole) {
                                        element.replaceWith(null);
                                    } else {
                                        //do nothing (remove server attributes)
                                        element.removeAttr('server-user-in-role').removeAttr('server:user-in-role');
                                    }
                                }
                            },
                            post: function post() {
                                //
                            }
                        };
                    }
                };
            }]);
        }
    }]);

    return AngularServerModuleDefaults;
}();
//# sourceMappingURL=directives.js.map