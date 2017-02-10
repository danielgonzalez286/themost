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
import async from 'async';
import crypto from 'crypto';
import {Args, TraceUtils, RandomUtils} from '@themost/common/utils';
import {HttpError, HttpNotFoundError, AbstractClassError, AbstractMethodError} from '@themost/common/errors';
import {HttpNextResult,HttpEndResult,HttpResult,HttpAnyResult} from './results';
import {AuthConsumer, BasicAuthConsumer, EncryptionStrategy, DefaultEncyptionStrategy} from './auth';
import {RestrictAccessConsumer,RestrictAccessService} from './restrict_access';
import {HttpConsumer,HttpRouteConsumer,HttpErrorConsumer} from './consumers';
import {StaticContentConsumer} from './static';
import {HttpContext} from './context';
import {RoutingStrategy,DefaultRoutingStrategy} from './route';
import {LocalizationStrategy,DefaultLocalizationStrategy} from './localization';
import {CacheStrategy,DefaultCacheStrategy} from './cache';
import {Rx} from 'rx';
import path from 'path';
import http from 'http';
import https from 'https';
import {HttpApplicationService} from "./interfaces";

const HTTP_SERVER_DEFAULT_BIND = '127.0.0.1';
const HTTP_SERVER_DEFAULT_PORT = 3000;

/**
 * Starts current application
 * @private
 * @static
 * @param {ApplicationOptions|*} options
 */
function startInternal(options) {
    /**
     * @type {HttpApplication2|*}
     */
    const self = this;
    try {
        /**
         * @memberof process.env
         * @property {number} PORT
         * @property {string} IP
         * @property {string} NODE_ENV
         */
        const opts = {
            bind:(process.env.IP || HTTP_SERVER_DEFAULT_BIND),
            port:(process.env.PORT ? process.env.PORT: HTTP_SERVER_DEFAULT_PORT)
        };
        //extend options
        _.assign(opts, options);

        const server_ = http.createServer(function (request, response) {
            const context = self.createContext(request, response);
            //begin request processing
            Rx.Observable.fromNodeCallback(processRequestInternal)(context)
                .subscribe((result)=> {
                    context.finalize(function() {
                        if (context.response) { context.response.end(); }
                    });
            }, (err) => {
                //process error
                Rx.Observable.fromNodeCallback(processErrorInternal)(context, err)
                    .subscribe((res) => {
                        context.finalize(function() {
                            if (context.response) { context.response.end(); }
                        });
                    }, (err) => {
                        //an error occurred while handling request error
                        TraceUtils.error(err);
                        if (context && context.response) {
                            if (err instanceof HttpError) {
                                const statusCode = err.status || 500;
                                //send a text/plain error (and safely end response)
                                context.response.writeHead(statusCode, {"Content-Type": "text/plain"});
                                context.response.write(statusCode + ' ' + err.message + '\n');
                            }
                            else {
                                //send a text/plain error (and safely end response)
                                context.response.writeHead(500, {"Content-Type": "text/plain"});
                                context.response.write('500 Internal Server Error\n');
                            }

                            context.finalize(function() {
                                if (context.response) { context.response.end(); }
                            });
                        }
                    });
            });
        });
        self[serverProperty] = server_;
        //start listening
        server_.listen(opts.port, opts.bind);
        TraceUtils.log('Web application is running at http://%s:%s/', opts.bind, opts.port);
    } catch (err) {
        TraceUtils.log(err);
    }
}

/**
 * Initializes application
 * @private
 * @static
 * @return {HttpApplication2}
 */
function initInternal() {

    /**
     * @type {HttpApplication2|*}
     */
    const self = this;
    /**
     * Gets or sets application configuration settings
     */
        //get node environment
    const env = process.env['NODE_ENV'] || 'production';

    let str;
    //first of all try to load environment specific configuration
    try {
        TraceUtils.log('Init: Loading environment specific configuration file (app.%s.json)', env);
        str = path.join(process.cwd(), 'config', 'app.' + env + '.json');
        /**
         * @type {HttpApplicationConfig}
         */
        self[configProperty] = require(str);
        TraceUtils.log('Init: Environment specific configuration file (app.%s.json) was succesfully loaded.', env);
    }
    catch (err) {
        if (err.code === 'MODULE_NOT_FOUND') {
            TraceUtils.log('Init: Environment specific configuration file (app.%s.json) is missing.', env);
            //try to load default configuration file
            try {
                TraceUtils.log('Init: Loading environment default configuration file (app.json)');
                str = path.join(process.cwd(), 'config', 'app.json');
                /**
                 * @type {HttpApplicationConfig}
                 */
                self.config = require(str);
                TraceUtils.log('Init: Default configuration file (app.json) was succesfully loaded.');
            }
            catch (err) {
                if (err.code === 'MODULE_NOT_FOUND') {
                    TraceUtils.log('Init: An error occured while loading default configuration (app.json). Configuration cannot be found or is inaccesible.');
                    //load internal configuration file
                    /**
                     * @type {HttpApplicationConfig}
                     */
                    let conf = require('./resources/app.json');
                    conf.settings = conf.settings || {};
                    conf.settings.crypto = {
                        "algorithm": "aes256",
                        "key": RandomUtils.randomHex(32)
                    };
                    this[configProperty] = conf;
                    TraceUtils.log('Init: Internal configuration file (app.json) was succesfully loaded.');
                }
                else {
                    TraceUtils.log('Init: An error occured while loading default configuration (app.json)');
                    throw err;
                }
            }
        }
        else {
            TraceUtils.log('Init: An error occured while loading application specific configuration (app).', env);
            throw err;
        }
    }
}
/**
 * Processes an HTTP request under current application
 * @private
 * @static
 * @param {HttpContext} context
 * @param {Function} callback
 */
function processRequestInternal(context, callback) {
    /**
     * @type {HttpApplication2|*}
     */
    const self = this,
        /**
         * @type {Array}
         */
        consumers = context.getApplication()[consumersProperty];

    return async.eachSeries(consumers,
        /**
         * @param {HttpConsumer} consumer
         * @param {Function} cb
         */
        function(consumer, cb) {
        consumer.callable.apply(context).subscribe(result=> {
            //if result is an instance of HttpNextResult
            if (result instanceof HttpNextResult) {
                //continue series execution (call series callback with no error)
                return cb();
            }
            else if (result instanceof HttpResult) {
                //continue series execution (call series callback with no error)
                return cb(result);
            }
            //else break series execution and return result
            return cb(new HttpAnyResult(result));
        }, err=> {
            return cb(err);
        });
    }, function(finalRes) {
            if (_.isNil(finalRes)) {
                //get otherwise consumer
                const otherWiseConsumer = self[otherwiseConsumerProperty];
                if (otherWiseConsumer instanceof HttpConsumer) {
                    if (!_.isFunction(otherWiseConsumer.callable)) {
                        return callback(new ReferenceError('HTTP consumer callable must be a function.'));
                    }
                    return otherWiseConsumer.callable.apply(context).subscribe(result=> {
                        if (result instanceof HttpNextResult) {
                            return callback(new HttpNotFoundError());
                        }
                        else if (result instanceof HttpResult) {
                            //continue series execution (call series callback with no error)
                            return callback(null, finalRes);
                        }
                        //else break series execution and return result
                        return callback(new HttpAnyResult(result));
                    }, err => {
                        return callback(err);
                    });
                }
                else {
                    return callback(new HttpNotFoundError());
                }
            }
            //if result is an error
            if (finalRes instanceof Error) {
                return callback(finalRes);
            }
            return callback(null, finalRes);
    });
}

/**
 * Processes HTTP errors under current application
 * @param {HttpContext} context
 * @param {Error|*} error
 * @param {Function} callback
 */
function processErrorInternal(context, error, callback) {
    /**
     * @type {HttpApplication2|*}
     */
    const self = this,
        /**
         * @type {Array}
         */
        errorConsumers = context.getApplication()[errorConsumersProperty];
        if (errorConsumers.length==0) {
            return callback(error);
        }
    return async.eachSeries(errorConsumers, function(consumer, cb) {
        consumer.callable.call(context, error).subscribe(result=> {
            if (result instanceof HttpNextResult) {
                return cb();
            }
            return cb(result);
        }, err=> {
            return cb(err);
        });
    }, function(err) {
        return callback(err);
    });
}

const currentProperty = Symbol('current');
const consumersProperty = Symbol('consumers');
const errorConsumersProperty = Symbol('errorConsumers');
const otherwiseConsumerProperty = Symbol('otherwise');
const configProperty = Symbol('config');
const serverProperty = Symbol('server');
const servicesProperty = Symbol('services');

/**
 * @classdesc Represents an HTTP server application
 * @class
 */
export class HttpApplication2 {
    /**
     * @constructor
     */
    constructor() {
        this[consumersProperty] = [];
        this[errorConsumersProperty] = [];
        this[configProperty] = {};
        this[servicesProperty] = {};
        this.executionPath = process.cwd();
    }

    /**
     * @returns {HttpApplicationConfig|*}
     */
    getConfiguration() {
        return this[configProperty];
    }

    /**
     * @returns {Server|*}
     */
    getServer() {
        return this[serverProperty];
    }

    /**
     * @param {Function|HttpConsumer} consumer
     * @param {*=} params
     * @returns HttpApplication2
     */
    any(consumer, params) {
        if (consumer instanceof HttpConsumer) {
            this[consumersProperty].push(consumer);
        }
        else {
            this[consumersProperty].push(new HttpConsumer(consumer, params));
        }
        return this;
    }

    /**
     * @param {Function|HttpErrorConsumer} consumer
     * @param {*=} params
     * @returns HttpApplication2
     */
    error(consumer, params) {
        if (consumer instanceof HttpErrorConsumer) {
            this[errorConsumersProperty].push(consumer);
        }
        else {
            this[errorConsumersProperty].push(new HttpErrorConsumer(consumer, params));
        }
        return this;
    }

    /**
     * @param {string} uri
     * @param {Function|HttpConsumer} consumer
     * @param {*=} params
     * @returns HttpApplication2
     */
    when(uri, consumer, params) {
        if (consumer instanceof HttpRouteConsumer) {
            this[consumersProperty].push(consumer);
        }
        else {
            this[consumersProperty].push(new HttpRouteConsumer(uri,consumer, params));
        }
        return this;
    }

    /**
     * @param {Function|HttpConsumer} consumer
     * @param {*=} params
     * @returns HttpApplication2
     */
    otherwise(consumer, params) {
        if ((consumer instanceof HttpConsumer) || (consumer instanceof HttpErrorConsumer)) {
            this[otherwiseConsumerProperty] = consumer;
        }
        else {
            this[otherwiseConsumerProperty] = new HttpConsumer(consumer, params);
        }
        return this;
    }

    /**
     * Register a service type in application services
     * @param {Function} serviceCtor
     */
    useService(serviceCtor) {
        Args.notFunction(serviceCtor,"Service constructor");
        this[servicesProperty][`${serviceCtor.name}`] = new serviceCtor(this);
    }

    /**
     * Register a service type in application services
     * @param {Function} serviceCtor
     * @param {Function} strategyCtor
     */
    useStrategy(serviceCtor, strategyCtor) {
        Args.notFunction(strategyCtor,"Service constructor");
        Args.notFunction(strategyCtor,"Strategy constructor");
        this[servicesProperty][`${serviceCtor.name}`] = new strategyCtor(this);
    }

    /**
     * Register a service type in application services
     * @param {Function} serviceCtor
     */
    getService(serviceCtor) {
        Args.notFunction(serviceCtor,"Service constructor");
        return this[servicesProperty][`${serviceCtor.name}`];
    }

    /**
     * Checks if a service of the given type exists in application services
     * @param {Function} serviceCtor
     * @returns boolean
     */
    hasService(serviceCtor) {
        return this[servicesProperty].hasOwnProperty(`${serviceCtor.name}`);
    }


    /**
     * Enables application default routing strategy
     * @returns {HttpApplication2}
     */
    useRoutingStrategy() {
        return this.useStrategy(RoutingStrategy, DefaultRoutingStrategy);
    }

    /**
     * Enables application default routing strategy
     * @returns {HttpApplication2}
     */
    useCacheStrategy() {
        return this.useStrategy(CacheStrategy, DefaultCacheStrategy);
    }

    /**
     * Enables application default routing strategy
     * @returns {HttpApplication2}
     */
    useEncryptionStrategy() {
        return this.useStrategy(EncryptionStrategy, DefaultEncyptionStrategy);
    }

    /**
     * Enables application default localization strategy
     * @returns {HttpApplication2}
     */
    useLocalization() {
        return this.useStrategy(LocalizationStrategy, DefaultLocalizationStrategy);
    }

    /**
     * Enables basic authentication
     * @returns {HttpApplication2}
     */
    useBasicAuthentication() {
        return this.any(new BasicAuthConsumer());
    }

    /**
     * Enables application authentication
     * @returns {HttpApplication2}
     */
    useRestrictAccess() {
        this.useService(RestrictAccessService);
        return this.any(new RestrictAccessConsumer());
    }

    /**
     * Enables application authentication
     */
    useAuthentication() {
        this.useStrategy(EncryptionStrategy, DefaultEncyptionStrategy);
        return this.any(new AuthConsumer());
    }

    /**
     * Enables static content requests
     * @param {string=} rootDir
     * @returns {HttpApplication2}
     */
    useStaticContent(rootDir) {
        return this.any(new StaticContentConsumer(rootDir));
    }

    /**
     * Enables static content requests
     * @param {string=} whenDir
     * @param {string=} rootDir
     * @returns {HttpApplication2}
     */
    whenStaticContent(whenDir, rootDir) {
        return this.any(new StaticContentConsumer(rootDir, whenDir));
    }

    /**
     * Starts the current HTTP application.
     * @param {HttpApplicationOptions=} options
     * @return {HttpApplication2}
     */
    start(options) {
        initInternal.call(this);
        startInternal.call(this);
        return this;
    }

    /**
     * Creates an instance of HttpContext class.
     * @param {ClientRequest} request
     * @param {ServerResponse} response
     * @returns {HttpContext}
     */
    createContext(request, response) {
       return new HttpContext(this, request, response);
    }

    /**
     * @returns {HttpApplication2}
     */
    static getCurrent() {
        if (_.isNil(HttpApplication2[currentProperty])) {
            HttpApplication2[currentProperty] = new HttpApplication2();
        }
        return HttpApplication2[currentProperty];
    }

}