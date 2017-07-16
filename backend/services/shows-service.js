// @flow

const moment = require('moment');
const Show = require('../models/show');
const Production = require('../models/production');
require('../models/person');

const queryShows = async opts => {
    const { year, month, day } = opts;
    const fields = opts.fields ? opts.fields.split(/,/) : [];

    const base = moment(`${day || '01'}.${month}.${year}`, 'DD.MM.YYYY', true);
    if (!base.isValid()) {
        throw {
            status: 400,
            message: 'Invalid input',
        };
    }

    const from = base.clone().startOf(day ? 'day' : 'month');
    const until = base.clone().endOf(day ? 'day' : 'month');
    let query = Show.find().lean().where('date')
        .gte(from.toDate())
        .lte(until.toDate());

    if (opts.location) {
        const productions = await Production.find({ location: opts.location });
        query.where('production').in(productions.map(p => p._id));
    }

    if (fields.includes('production')) {
        query.populate('production');
    } else {
        query.select({ production: false });
    }

    if (fields.includes('cast')) {
        query.populate('cast.person');
    } else {
        query.select({ cast: false });
    }

    if (opts.count) {
        query.count();
    } else {
        query.sort({ date: 'ascending' });
    }

    return query;
};

module.exports = { queryShows };