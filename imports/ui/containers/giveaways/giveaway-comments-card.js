import { composeWithTracker } from 'react-komposer';
import { Meteor } from 'meteor/meteor';
import { GiveawayCommentsCard } from '../../components/giveaways/giveaway-comments-card';
import { Loading } from '../../components/loading';

import { Giveaways } from '../../../api/giveaways/giveaways';
import { GiveawayComments } from '../../../api/giveaway-comments/giveaway-comments';

import * as GiveawaysHelper from '../../../util/giveaways';

const composer = (props, onData) => {
  if (Meteor.subscribe('comments-for-giveaway', props.gaId).ready()) {
    const ga = Giveaways.findOne(props.gaId);
    const sortedComments = GiveawayComments.find({
      giveawayId: props.gaId,
      isRemoved: { $ne: true }
    }, {
      sort: { createdAt: -1 }
    });

    const denormalizedComments = sortedComments.map(comment => {
      return {
        user: Meteor.users.findOne(comment.userId),
        content: comment.content,
        createdAt: comment.createdAt
      };
    });

    onData(null, {
      ga: ga,
      comments: denormalizedComments,
      owner: Meteor.users.findOne(ga.userId),
    });
  }
};

export default composeWithTracker(composer, Loading)(GiveawayCommentsCard);