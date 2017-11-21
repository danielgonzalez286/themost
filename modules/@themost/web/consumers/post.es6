/**
 * @license
 * MOST Web Framework 2.0 Codename Blueshift
 * Copyright (c) 2014, Kyriakos Barbounakis k.barbounakis@gmail.com
 *                     Anthi Oikonomou anthioikonomou@gmail.com
 *
 * Use of this source code is governed by an BSD-3-Clause license that can be
 * found in the LICENSE file at https://themost.io/license
 */
import 'source-map-support/register';
import formidable from 'formidable';
import _ from 'lodash';
import {LangUtils,TraceUtils} from '@themost/common/utils';
import {HttpConsumer} from '../consumers';
import Q from 'q';
import {HttpNextResult} from '../results';

/**
 * @classdesc Default post content handler (as it has been implemented for version 1.x of MOST Web Framework)
 * @class
 */
class PostHandler {
    /**
     *
     * @param {HttpContext} context
     * @param {Function} callback
     */
    beginRequest(context, callback) {
        try {
            const request = context.request;
            //extend params object (parse form data)
            if (typeof request.socket === 'undefined') {
                return callback();
            }
            else {
                request.headers = request.headers || {};
                if (/^application\/x-www-form-urlencoded/i.test(request.headers['content-type'])) {
                    //use formidable to parse request data
                    const f = new formidable.IncomingForm();
                    f.parse(request, function (err, form, files) {
                        if (err) {
                            return callback(err);
                        }
                        try {
                            //add form
                            if (form) {
                                _.assign(context.params, LangUtils.parseForm(form));
                            }
                            //add files
                            if (files)
                                _.assign(context.params, files);
                            return callback();
                        }
                        catch (err) {
                            return callback(err);
                        }
                    });
                }
                else {
                    return callback();
                }

            }
        }
        catch  (e) {
            TraceUtils.log(e);
            return callback(new Error("An internal server error occured while parsing request data."));
        }

    }
}

/**
 * @class
 */
export class PostContentConsumer extends HttpConsumer {
    constructor() {
        super(function(context) {
            try {
                const handler = new PostHandler();
                return Q.nfbind(handler.beginRequest)(context)
                    .then(()=> {
                        return HttpNextResult.create().toPromise();
                    });
            }
            catch(err) {
                return Q.reject(err);
            }
        });
    }
}