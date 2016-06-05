import { Meteor } from 'meteor/meteor';

import { Giveaways } from '../giveaways';

Meteor.publish('giveaways-current-upcoming', function(date) {
  check(date, Date);
  return Giveaways.find({
    dateEnd:    { $gte: date, },                                    // Must not be over
    dateStart:  { $lte: moment(date).subtract(1, 'd').toDate(), },  // Must be ongoing/starting in the next 24 hours
    deleted:    { $ne: true },
  });
});
