"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amenities = exports.Labels = exports.Stay = void 0;
class Stay {
    _id;
    name;
    type;
    imgUrls;
    price;
    summary;
    capacity;
    amenities;
    roomType;
    host;
    loc;
    reviews;
    likedByUsers;
    labels;
    equipment;
    rate;
    constructor(_id, name, type, imgUrls, price, summary, capacity, amenities, roomType, host, loc, reviews, likedByUsers, labels, equipment, rate) {
        this._id = _id;
        this.name = name;
        this.type = type;
        this.imgUrls = imgUrls;
        this.price = price;
        this.summary = summary;
        this.capacity = capacity;
        this.amenities = amenities;
        this.roomType = roomType;
        this.host = host;
        this.loc = loc;
        this.reviews = reviews;
        this.likedByUsers = likedByUsers;
        this.labels = labels;
        this.equipment = equipment;
        this.rate = rate;
    }
    setId(id = 's101') {
        this._id = id;
    }
    static fromObject(obj) {
        return new Stay(obj._id || '', obj.name || '', obj.type || '', obj.imgUrls || [], obj.price || 0, obj.summary || '', obj.capacity || 0, obj.amenities || [], obj.roomType || '', obj.host, obj.loc, obj.reviews || [], obj.likedByUsers || [], obj.labels || [], obj.equipment || { bedsNum: 0, bathNum: 0, bedroomNum: 0 }, obj.rate || 0);
    }
    static getEmptyStay() {
        return new Stay('', '', '', ['', '', '', '', ''], 0, '', 0, [], '', {}, { country: '', countryCode: '', city: '', address: '', lat: 0, lng: 0 }, [], [], [], { bedsNum: null, bathNum: null, bedroomNum: null }, 0);
    }
}
exports.Stay = Stay;
exports.Labels = [
    'Rooms',
    'Amazing pools',
    'Amazing views',
    'OMG!',
    'Design',
    'Castles',
    'Lakefront',
    'Cabins',
    'Islands',
    'Beachfront',
    'Luxe',
    'Trending',
    'Countryside',
    'National parks',
    'Off-the-grid',
    'Play',
    'Earth homes',
    'Tropical',
    'Caves',
    'Boats',
    'Iconic',
    'Skiing',
    'Ski-in/out',
    'Ryokans',
    'casas particulares',
    'Hanoks',
    'Campers',
    'Golfing',
    'Minsus',
    'Adapted',
    'Beach',
];
exports.Amenities = {
    essentials: [
        'Wifi',
        'Kitchen',
        'Private attached bathroom',
        'Washing machine',
        'Dryer',
        'Air conditioning',
        'Heating',
        'Dedicated workspace',
        'TV',
        'Hair dryer',
    ],
    all: [
        'Internet',
        'Doorman',
        'Elevator',
        'Buzzer/wireless intercom',
        'Family/kid friendly',
        'Smoke detector',
        'Carbon monoxide detector',
        'First aid kit',
        'Safety card',
        'Fire extinguisher',
        'Essentials',
        'Shampoo',
        '24-hour check-in',
        'Hangers',
        'Iron',
        'Laptop friendly workspace',
        'Outlet covers',
        'Bathtub',
        'High chair',
        'Children’s books and toys',
        'Window guards',
        'Crib',
        'Pack ’n Play/travel crib',
        'Room-darkening shades',
        'Hot water',
        'Body soap',
        'Bath towel',
        'Toilet paper',
        'Bed linens',
        'Extra pillows and blankets',
        'Microwave',
        'Coffee maker',
        'Refrigerator',
        'Dishwasher',
        'Dishes and silverware',
        'Cooking basics',
        'Oven',
        'Single level home',
        'Patio or balcony',
        'Long term stays allowed',
        'Wide clearance to bed',
        'Step-free access',
        'Wide doorway',
        'Wide entryway',
        'Host greets you',
        'Mountain view',
        'Balcony',
        'Sound system',
        'Breakfast table',
        'Espresso machine',
        'Convection oven',
        'Standing valet',
        'Paid parking on premises',
        'Bedroom comforts',
        'Bathroom essentials',
    ],
    features: [
        'Pool',
        'Hot tub',
        'Free parking on premises',
        'EV charger',
        'Cot',
        'Gym',
        'BBQ grill',
        'Breakfast',
        'Indoor fireplace',
        'Smoking allowed',
    ],
    location: ['Beachfront', 'Waterfront'],
    safety: ['Smoke alarm', 'Carbon monoxide alarm'],
};
//# sourceMappingURL=stay.model.cjs.map