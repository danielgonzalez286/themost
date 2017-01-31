/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com
 *                     Anthi Oikonomou anthioikonomou@gmail.com
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
'use strict';
import {_} from 'lodash';

function toBoolean(value) {
    if (typeof value === 'function') {
        value = true;
    } else if (value && value.length !== 0) {
        const v = lowercase("" + value);
        value = !(v == 'f' || v == '0' || v == 'false' || v == 'no' || v == 'n' || v == '[]');
    } else {
        value = false;
    }
    return value;
}
function getBlockElements(angular, nodes) {
    const startNode = nodes[0], endNode = nodes[nodes.length - 1];
    if (startNode === endNode) {
        return angular.element(startNode);
    }

    let element = startNode;
    const elements = [element];

    do {
        element = element.nextSibling;
        if (!element) break;
        elements.push(element);
    } while (element !== endNode);

    return angular.element(elements);
}
/**
 * @param {HttpApplication} app
 */
export function apply(app) {
    app.module.directive('ejsInclude', function($context, $angular, $qs, $sce) {
        return {
            replace:true,
            restrict:'EA',
            link: function (scope, element, attrs) {
                /**
                 * @ngdoc attrs
                 * @property {string} ejsInclude
                 * @property {string} src
                 */
                const src = attrs.ejsInclude || attrs.src;
                if (src) {
                    const deferred = $qs.defer();
                    $context.application.executeRequest( { url: src, cookie: $context.request.headers.cookie }, function(err, result) {
                        if (err) {
                            element.replaceWith(null);
                            deferred.reject(err.message);
                        }
                        else {
                            element.removeAttr('data-src');
                            element.replaceWith($angular.element(result.body.replace(/\n/,'')));
                            deferred.resolve();
                        }
                    });
                }
            }
        };
    }).directive('ejsInit', function() {
        return {
            priority:400,
            restrict:'A',
            link: function (scope, element, attrs) {
                scope.$eval(attrs['ejsInit']);
            }
        };
    }).directive('ejsIf', function($animate, $document) {
        return {
            transclude: 'element',
            priority: 600,
            terminal: true,
            restrict: 'A',
            $$tlb: true,
            link: function ($scope, $element, $attr, ctrl, $transclude) {
                let block, childScope, previousElements;
                const ejsIf = $attr['ejsIf'], parentDocument = $document.get(0);
                $scope.$watch(ejsIf, function ngIfWatchAction(value) {
                    if (toBoolean(value)) {
                        if (!childScope) {
                            childScope = $scope.$new();
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
                            previousElements = getBlockElements(angular, block.clone);
                            $animate.leave(previousElements, function () {
                                previousElements = null;
                            });
                            block = null;
                        }
                    }
                });
            }
        };
    }).directive('ejsIfPermission', ['$context','$compile', '$qs', function($context, $compile, $qs) {
        return {
            restrict:'E',
            replace: true,
            scope: { model:'@',mask:'@',state:'@' },
            compile:function() {
                return {
                    pre: function preLink(scope, element) {
                        const DataPermissionEventListener = require('most-data').classes.DataPermissionEventListener;
                        const deferred = $qs.defer();
                        try {
                            const targetModel = $context.model(scope.model);
                            if (_.isNil(scope.state)) {
                                if (scope.mask)
                                    if (scope.mask == 1)
                                        scope.state = 0;
                                    else if (scope.mask == 2)
                                        scope.state = 1;
                                    else if (scope.mask == 4)
                                        scope.state = 2;
                                    else if (scope.mask == 8)
                                        scope.state = 4;
                                    else
                                        scope.state = scope.mask;
                            }
                            const p = new DataPermissionEventListener(), e = { model: targetModel, state: scope.state, throwError:false };



                            p.validate(e, function(err) {
                                if (e.result) {
                                    const result = $compile(element.contents())(scope);
                                    element.replaceWith(result);
                                    deferred.resolve();
                                }
                                else {
                                    element.replaceWith(null);
                                    deferred.resolve();
                                }
                            });
                        }
                        catch(err) {
                            deferred.reject(err.message);
                        }


                    },
                    post: angular.noop
                }
            }
        };
    }]).directive('ejsLoc', ['$context', function($context) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                /**
                 * @ngdoc
                 * @name attrs
                 * @property {string} ejsLoc
                 * @private
                 */
                if (attrs.title)
                    element.attr('title', $context.translate(attrs.title, attrs.ejsLoc));
                if (attrs.placeholder)
                    element.attr('placeholder', $context.translate(attrs.placeholder, attrs.ejsLoc));
            }
        };
    }]).directive('ejsLocHtml', ['$context', function($context) {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                /**
                 * @ngdoc
                 * @name attrs
                 * @property {string} ejsLocHtml
                 * @private
                 */
                const text = $context.translate(element.html(), attrs.ejsLocHtml);
                if (text)
                    element.html(text);
            }
        };
    }]).directive('ejsUserInRole', ['$context', '$compile', function($context, $compile) {
        return {
            restrict:'A',
            replace: true,
            priority: 100,
            compile:function() {
                return {
                    pre: function preLink(scope, element, attrs) {
                        const user = $context.user;
                        if (typeof user !== 'undefined') {
                            user.groups = user.groups || [];
                            /**
                             * @ngdoc attrs
                             * @property {string} ejsUserInRole
                             *
                             * @type {Array}
                             * @private
                             */
                            const roles = (attrs.ejsUserInRole || '').split(',');
                            let inRole = (user.groups.filter(function(x) {
                                return (roles.indexOf(x.name)>=0);
                            }).length>0);
                            //validate not statement e.g. ejs-user-in-role='!Administrators'
                            if (!inRole) {
                                roles.forEach(function(x) {
                                    if (!inRole) {
                                        if (x.indexOf('!')==0) {
                                            inRole = (user.groups.filter(function(y) {
                                                return (x.substr(1).indexOf(y.name)>=0);
                                            }).length==0);
                                        }
                                    }
                                });
                            }
                            if (!inRole) {
                                element.replaceWith(null);
                            }
                            else {
                                //do nothing (remove server attributes)
                                element.removeAttr('ejs-user-in-role').removeAttr('ejs:user-in-role');
                            }
                        }
                    },
                    post: angular.noop
                }
            }
        };
    }]);
}
