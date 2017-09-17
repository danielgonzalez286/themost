
'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _dec, _dec2, _dec3, _dec4, _dec5, _dec6, _dec7, _dec8, _dec9, _dec10, _dec11, _desc, _value, _class;

var _mvc = require('../../../modules/@themost/web/mvc');

var HttpController = _mvc.HttpController;

var _decorators = require('../../../modules/@themost/web/decorators');

var httpAction = _decorators.httpAction;
var httpGet = _decorators.httpGet;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _applyDecoratedDescriptor(target, property, decorators, descriptor, context) {
    var desc = {};
    Object['ke' + 'ys'](descriptor).forEach(function (key) {
        desc[key] = descriptor[key];
    });
    desc.enumerable = !!desc.enumerable;
    desc.configurable = !!desc.configurable;

    if ('value' in desc || desc.initializer) {
        desc.writable = true;
    }

    desc = decorators.slice().reverse().reduce(function (desc, decorator) {
        return decorator(target, property, desc) || desc;
    }, desc);

    if (context && desc.initializer !== void 0) {
        desc.value = desc.initializer ? desc.initializer.call(context) : void 0;
        desc.initializer = undefined;
    }

    if (desc.initializer === void 0) {
        Object['define' + 'Property'](target, property, desc);
        desc = null;
    }

    return desc;
}

/**
 * @class
 */
var RootController = (_dec = httpGet(), _dec2 = httpGet(), _dec3 = httpAction('hello'), _dec4 = httpGet(), _dec5 = httpAction('helloMarkdown'), _dec6 = httpGet(), _dec7 = httpAction('helloJade'), _dec8 = httpGet(), _dec9 = httpAction('helloAngular'), _dec10 = httpGet(), _dec11 = httpAction('helloVash'), (_class = function (_HttpController) {
    _inherits(RootController, _HttpController);

    function RootController() {
        _classCallCheck(this, RootController);

        return _possibleConstructorReturn(this, (RootController.__proto__ || Object.getPrototypeOf(RootController)).call(this));
    }
    /*jshint ignore:start*/


    _createClass(RootController, [{
        key: 'index',

        /*jshint ignore:end*/
        value: function index() {
            return this.content('Hello World').toObservable();
        }
        /* jshint ignore:start*/

    }, {
        key: 'getHello',

        /* jshint ignore:end*/
        value: function getHello() {
            return this.json({
                message: 'Hello World'
            }).toObservable();
        }
        /* jshint ignore:start*/

    }, {
        key: 'getHelloMarkdown',

        /* jshint ignore:end */
        value: function getHelloMarkdown() {
            return this.view();
        }
        /* jshint ignore:start*/

    }, {
        key: 'getHelloJade',

        /* jshint ignore:end */
        value: function getHelloJade() {
            return this.view();
        }
        /* jshint ignore:start*/

    }, {
        key: 'getHelloAngular',

        /* jshint ignore:end */
        value: function getHelloAngular() {
            return this.view();
        }
        /* decorators */
        /* jshint ignore:start*/

    }, {
        key: 'getHelloVash',

        /* jshint ignore:end */
        value: function getHelloVash() {
            return this.view({ "name": "George" });
        }
    }]);

    return RootController;
}(HttpController), (_applyDecoratedDescriptor(_class.prototype, 'index', [_dec], Object.getOwnPropertyDescriptor(_class.prototype, 'index'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getHello', [_dec2, _dec3], Object.getOwnPropertyDescriptor(_class.prototype, 'getHello'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getHelloMarkdown', [_dec4, _dec5], Object.getOwnPropertyDescriptor(_class.prototype, 'getHelloMarkdown'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getHelloJade', [_dec6, _dec7], Object.getOwnPropertyDescriptor(_class.prototype, 'getHelloJade'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getHelloAngular', [_dec8, _dec9], Object.getOwnPropertyDescriptor(_class.prototype, 'getHelloAngular'), _class.prototype), _applyDecoratedDescriptor(_class.prototype, 'getHelloVash', [_dec10, _dec11], Object.getOwnPropertyDescriptor(_class.prototype, 'getHelloVash'), _class.prototype)), _class));

//noinspection JSUnusedGlobalSymbols

exports.default = RootController;
module.exports = exports['default'];
//# sourceMappingURL=root-controller.js.map
