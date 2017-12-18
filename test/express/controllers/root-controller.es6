import {HttpController} from '../../../modules/@themost/web/mvc';
import {httpAction,httpGet} from './../../../modules/@themost/web/decorators';
import Q from 'q';
import 'source-map-support/register';


export default class RootController extends HttpController {

    constructor() {
        super();
    }

    @httpGet()
    @httpAction("index")
    index() {
        return Q(this.content('<p>Hello World</p>'));
    }

    @httpGet()
    @httpAction("person")
    person() {
        return Q({
          givenName:'Peter',
          familyName:'Adams'
        });
    }

}