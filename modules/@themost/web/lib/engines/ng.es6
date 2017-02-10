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

import fs from 'fs';
import {HttpNotFoundError} from '@themost/common/errors';
import {HttpContext} from './../context';

/**
 * @class
 * @classdesc NgEngine instance implements Angular JS View Engine for Server
 * @property {HttpContext} context
 * @augments {HttpViewEngine}
 */
export default class NgEngine {
    /**
     * @constructor
     * @param {HttpContext} context
     */
    constructor(context) {
        let context_ = context;
        Object.defineProperty(this,'context', {
            get: function() {
                return context_;
            },
            set: function(value) {
                context_ = value;
            },
            configurable:false,
            enumerable:false
        });
    }

    /**
     *
     * @param {string} filename
     * @param {*=} data
     * @param {Function} callback
     */
    render(filename, data, callback) {
        const self = this;
        fs.readFile(filename,'utf-8', function(err, str) {
            try {
                if (err) {
                    if (err.code === 'ENOENT') {
                        //throw not found exception
                        return callback(new HttpNotFoundError('View layout cannot be found.'));
                    }
                    return callback(err);
                }
                else {
                    const viewContext = new HttpViewContext(self.context);
                    viewContext.data = data;
                    viewContext.body = str;
                    return callback(null, viewContext);
                }
            }
            catch (e) {
                callback(e);
            }
        });
    }
}