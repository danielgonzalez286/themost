"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.default = undefined;

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _chance = require("chance");

var Chance = _interopRequireDefault(_chance).default;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var JobTitles = "Accountant|Administrative|Administrative Assistant|Administrative Secretary|Administrative/Program Assistant|Aeronautical Information Specialist|Aerospace Engineer|Air Traffic Assistant|Air Traffic Control Specialist|Architecture Series|Aviation Safety Inspector|Aviation Technical System Specialist|Budget Analyst|Civil Engineer|Clerk/Assistant|Community Planner|Computer Scientist|Computer Specialist|Construction Control Technical|Contract Specialist|Economist|Electrical Engineering|Electronics Engineer|Electronics Technical|Engineering Technical|Environmental Engineering|Environmental Protection Specialist|General Attorney|General Engineer|General Inspection/Enforcement|Human Resource Specialist|Industrial Engineer|Information Technology Specialist|Logistics Management Specialist|Management/Program Analyst|Marine Survey Technical|Materials Engineering|Mechanical Engineering|Motor Carrier Safety Specialist|Naval Architecture|Operations Research Analyst|Program Manager|Railroad Safety|Safety Engineering|Survey Technical|Transportation Specialist";
var Streets = "Church Street|Main Street North|High Street|Main Street South|Elm Street|Washington Street|Main Street West|Walnut Street|2nd Street|Main Street East|Park Avenue|Chestnut Street|Broad Street|Maple Street|Center Street|Maple Avenue|Oak Street|Pine Street|Water Street|River Road|South Street|Union Street|Market Street|3rd Street|Court Street|North Street|Park Street|Washington Avenue|Prospect Street|Spring Street|Central Avenue|Mill Street|School Street|Franklin Street|Front Street|Cherry Street|Highland Avenue|1st Street|4th Street|Cedar Street|West Street|Jefferson Street|State Street|Bridge Street|Park Place|Madison Avenue|Jackson Street|Pleasant Street|Pearl Street|Pennsylvania Avenue|Spruce Street|Academy Street|Grove Street|Madison Street|Adams Street|Locust Street|5th Street|East Street|River Street|Elizabeth Street|Jefferson Avenue|Ridge Road|11th Street|12th Street|2nd Avenue|4th Street West|5th Avenue|Church Road|Dogwood Drive|Green Street|Hill Street|Lincoln Avenue|Meadow Lane|9th Street|Route 30|3rd Street West|7th Street|Broadway|Brookside Drive|Delaware Avenue|Liberty Street|Lincoln Street|Virginia Avenue|10th Street|Charles Street|College Street|Hickory Lane|Monroe Street|Route 1|Summit Avenue|Vine Street|13th Street|3rd Avenue|6th Street|Colonial Drive|Hillside Avenue|Sunset Drive|Winding Way|Woodland Drive|1st Avenue|2nd Street West|Clinton Street|Fairway Drive|New Street|Prospect Avenue|Railroad Avenue|Railroad Street|Route 32|Route 6|Valley Road|4th Avenue|5th Street North|Division Street|Lafayette Avenue|Lake Street|Mill Road|Oak Lane|Penn Street|Primrose Lane|Riverside Drive|Sherwood Drive|Williams Street|4th Street North|8th Street|Beech Street|Front Street North|Harrison Street|Hillcrest Drive|Park Drive|Poplar Street|Route 29|Warren Street|Willow Street|2nd Street East|6th Avenue|6th Street North|6th Street West|7th Avenue|Berkshire Drive|Cherry Lane|Circle Drive|Deerfield Drive|Heather Lane|Highland Drive|King Street|Laurel Lane|Laurel Street|Mulberry Street|Route 10|5th Street West|7th Street East|Arch Street|Cambridge Court|Cedar Lane|Dogwood Lane|George Street|Holly Drive|Lafayette Street|Lakeview Drive|Linden Street|Ridge Avenue|Smith Street|Surrey Lane|Valley View Drive|York Road|3rd Street East|Aspen Court|Bank Street|Buckingham Drive|Cambridge Drive|Canal Street|Carriage Drive|Clark Street|Colonial Avenue|Columbia Street|Creek Road|Durham Road|Elm Avenue|Essex Court|Forest Drive|Garden Street|Glenwood Avenue|Grant Avenue|Grant Street|Hamilton Street|Hillside Drive|James Street|John Street|Lilac Lane|Locust Lane|Magnolia Avenue|Maple Lane|Myrtle Avenue|Olive Street|Orange Street|Oxford Court|Woodland Avenue|2nd Street North|3rd Street North|5th Street South|6th Street East|8th Street East|Canterbury Court|Devon Road|Fairview Avenue|Franklin Avenue|Fulton Street|Grand Avenue|Lake Avenue|Magnolia Court|Oak Avenue|Orchard Street|Rosewood Drive|Route 9|Skyline Drive|Wall Street|Walnut Avenue|William Street|Windsor Court|12th Street East|8th Street West|9th Street West|Arlington Avenue|Beechwood Drive|Cedar Avenue|Chestnut Avenue|Clay Street|Cleveland Street|Cottage Street|Country Club Drive|Euclid Avenue|Garfield Avenue|Grove Avenue|Henry Street|Hickory Street|Laurel Drive|Magnolia Drive|Mechanic Street|Overlook Drive|Race Street|Route 11|Route 20|Route 4|Route 70|Summit Street|Sycamore Drive|Windsor Drive";
var Cities = "London|Birmingham, West Midlands|Glasgow|Leeds, West Yorkshire|Bristol|Liverpool, Merseyside|Manchester, Greater Manchester|Sheffield, South Yorkshire|Edinburgh|Cardiff|Leicester, Leicestershire|Stoke-on-Trent, Staffordshire|Bradford, West Yorkshire|Coventry, West Midlands|Nottingham, Nottinghamshire|Kingston-upon-Hull, East Riding of Yorkshire|Belfast|Newcastle-upon-Tyne, Tyne and Wear|Sunderland, Tyne and Wear|Brighton, East Sussex|Derby, Derbyshire|Plymouth, Devon|Wolverhampton, West Midlands|Southampton, Hampshire|Swansea|Salford, Greater Manchester|Portsmouth, Hampshire|Milton Keynes, Buckinghamshire|Aberdeen|Reading, Berkshire|Northampton, Northamptonshire|Luton, Bedfordshire|Swindon, Wiltshire|Warrington, Cheshire|Dudley, West Midlands|York, North Yorkshire|Bolton, Greater Manchester|Stockton-on-Tees, County Durham|Preston, Lancashire|Bournemouth, Dorset|Norwich, Norfolk|Middlesbrough, North Yorkshire|Peterborough, Cambridgeshire|Southend-on-Sea, Essex|Walsall, West Midlands|Colchester, Essex|Mansfield, Nottinghamshire|Telford, Shropshire|Ipswich, Suffolk|Huddersfield, West Yorkshire|Dundee|Oxford, Oxfordshire|Doncaster, South Yorkshire|Chelmsford, Essex|Cambridge, Cambridgeshire|Maidstone, Kent|Slough, Berkshire|Poole, Dorset|Blackburn, Lancashire|Chesterfield, Derbyshire|Blackpool, Lancashire|Newport|Birkenhead, Merseyside|St Alban’s, Hertfordshire|Hastings, East Sussex|Bedford, Bedfordshire|Gloucester, Gloucestershire|West Bromwich, West Midlands|Worcester, Worcestershire|Sale, Greater Manchester|Nuneaton, Warwickshire|Watford, Hertfordshire|Exeter, Devon|Solihull, West Midlands|Chester, Cheshire|High Wycombe, Buckinghamshire|Gateshead, Tyne and Wear|Southport, Merseyside|Rotherham, South Yorkshire|Cheltenham, Gloucestershire|Hove, East Sussex|Eastbourne, East Sussex|Worthing, West Sussex|Londonderry, County Londonderry|Rochdale, Greater Manchester|Basingstoke, Hampshire|Basildon, Essex|Crawley, West Sussex|Falkirk, Falkirk|Stockport, Greater Manchester|Darlington, County Durham|Woking, Surrey|Lincoln, Lincolnshire|Gillingham, Kent|Wigan, Greater Manchester|Oldham, Greater Manchester|St Helen’s, Merseyside|Tamworth, West Midlands|Carlisle, Cumbria|Dartford, Kent|Wakefield, West Yorkshire|Rayleigh, Essex|Hemel Hempstead, Hertfordshire|Bath, Somerset|Weymouth, Dorset|Hartlepool, County Durham|Barnsley, South Yorkshire|Stevenage, Hertfordshire|Grimsby, Lincolnshire|Halifax, West Yorkshire|Redditch, West Midlands|Weston-super-Mare, Somerset|Harlow, Essex|Burnley, Lancashire|Scunthorpe, Lincolnshire|Eastleigh, Hampshire|Bracknell, Berkshire|Bury, Greater Manchester|Guildford, Surrey|Paisley, Renfrewshire|Chatham, Kent|South Shields, Northumberland|Newcastle-under-Lyme, West Midlands|East Kilbride, Scotland|Harrogate, Yorkshire|Lisburn, Northern Ireland|Burton-upon-Trent, West Midlands|Aylesbury, Thames Valley|Crewe, Lancashire and Cheshire|Shrewsbury, West Midlands|Gosport, Wessex|Lowestoft, Anglia|Rugby, West Midlands|Stafford, West Midlands|Rossendale, Lancashire and Cheshire|Cannock, West Midlands|Tynemouth, Northumberland|Washington, Northumberland|Grays, Essex|Walton-on-Thames, Thames Valley|Craigavon, Northern Ireland|Farnborough, Wessex|Paignton, Wessex|Waterlooville, Wessex|Runcorn, Lancashire and Cheshire|Bognor Regis, Sussex|Maidenhead, Thames Valley|Stourbridge, West Midlands|Rochester, Kent|Dewsbury, Yorkshire|Scarborough, Yorkshire|Newtownabbey, Northern Ireland|Wrexham, Wales|Widnes, Lancashire and Cheshire|Margate, Kent|Ellesmere Port, Lancashire and Cheshire|Taunton, Wessex|Hereford, West Midlands|Wallasey, Lancashire and Cheshire|Bangor, Northern Ireland|Loughborough, East Midlands|Halesowen, West Midlands|Royal Tunbridge Wells, Kent|Bebington, Lancashire and Cheshire|Aldershot, Wessex|Macclesfield, Lancashire and Cheshire|Livingston, Scotland|Kettering, East Midlands|Royal Leamington Spa, West Midlands|Littlehampton, Sussex|Gravesend, Kent|Corby, East Midlands|Canterbury, Kent|Barry, Wales|Christchurch, Wessex|Keighley, Yorkshire|Hamilton, Scotland|Brentwood, Essex|Ewell, Thames Valley|Beeston, East Midlands|Bootle, Lancashire and Cheshire|Esher, Thames Valley|Kingswinford, West Midlands|Neath, Wales|Clacton-on-Sea, Essex|Crosby, Lancashire and Cheshire|Kirkcaldy, Scotland|Dunfermline, Scotland|Carlton, East Midlands|Wellingborough, East Midlands|Torquay, Wessex|Sittingbourne, Kent|Smethwick, West Midlands|Shoreham-by-Sea, Sussex|Welwyn Garden City, Anglia|Inverness, Scotland|Lancaster, Lancashire and Cheshire|Horsham, Sussex|Ayr, Scotland|Perth, Scotland";
var Avatars = "scott_gruber/128.jpg|ram_selvan/128.jpg|izi8000/128.jpg|nikkiccccc/128.jpg|carlosjgsousa/128.jpg|tehbarnaby/128.jpg|mrcndrw/128.jpg|wayneseymour01/128.jpg|menghe/128.jpg|noraalgalad/128.jpg|arhey/128.jpg|grv_quangminh/128.jpg|michalhron/128.jpg|acandito/128.jpg|morslicom/128.jpg|balintstweet/128.jpg|matthanns/128.jpg|nessoila/128.jpg|nesan_ui/128.jpg|jcutrell/128.jpg|davidnotte/128.jpg|dianatomic/128.jpg|sachacorazzi/128.jpg|_darwinnn/128.jpg|aarondgilmore/128.jpg|adamenkoigor/128.jpg|benjammartin/128.jpg|rocha_mkt/128.jpg|jas_jamires/128.jpg|sujeet_jaiswara/128.jpg|zidoway/128.jpg|jkdreaming/128.jpg|scottkclark/128.jpg|lrsbck/128.jpg|jorisstruijk/128.jpg|wangran1509/128.jpg|jeric_millena/128.jpg|masgilang/128.jpg|osmond/128.jpg|mrzanona/128.jpg|knilob/128.jpg|buniho/128.jpg|pagrro/128.jpg|baljeetjpr/128.jpg|adellecharles/128.jpg|gidmotion/128.jpg|hilahakim/128.jpg|ffleyd/128.jpg|skipwalker/128.jpg";

var Randoms = function () {
    function Randoms() {
        _classCallCheck(this, Randoms);
    }

    _createClass(Randoms, null, [{
        key: "address",
        value: function address() {
            var chance = new Chance();
            return {
                contactType: 'primary',
                streetAddress: chance.integer({ min: 5, max: 50 }) + ' ' + chance.pickone(Streets.split("|")),
                addressLocality: chance.pickone(Cities.split("|")),
                postalCode: chance.postal(),
                addressCountry: 'UK',
                telephone: chance.phone()
            };
        }
    }, {
        key: "gender",
        value: function gender() {
            var chance = new Chance();
            return chance.pickone(['M', 'F']);
        }
    }, {
        key: "person",
        value: function person() {
            var chance = new Chance();
            var gender = Randoms.gender();
            var genderOptions = {
                gender: gender === 'F' ? 'female' : 'male'
            };
            var res = {
                gender: gender,
                givenName: chance.first(genderOptions),
                familyName: chance.last(genderOptions),
                birthDate: chance.birthday(),
                jobTitle: chance.pickone(JobTitles.split("|")),
                image: "https://s3.amazonaws.com/uifaces/faces/twitter/".concat(chance.pickone(Avatars.split("|"))),
                address: Randoms.address()
            };
            var email = (res.givenName.toLocaleLowerCase() + '.' + res.familyName.toLocaleLowerCase() + '@example.com').replace(/'/g, '');
            res.description = res.givenName + ' ' + res.familyName;
            res.email = email;
            return res;
        }
    }]);

    return Randoms;
}();

exports.default = Randoms;
module.exports = exports['default'];
//# sourceMappingURL=randoms.js.map
