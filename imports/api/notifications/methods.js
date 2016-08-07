import { Giveaways } from '../giveaways/giveaways';
import { GiveawayComments } from '../giveaway-comments/giveaway-comments';

import { aggregateUserNames } from '../../util/notifications';
import * as RolesHelper from '../../util/roles';

if (Meteor.isServer) {
  Meteor.methods({

    // notifGroupId is a unique ID that can group pushed notifications together
    // userIds is an array of users whom you wish to send the notification to
    // callback has to return an object: { title, body, avatar: { type, val }, url, metadata }
    upsertNotifications: (notifGroupId, userIds, callback) => {
      check(notifGroupId, String);
      check(userIds, Array);
      check(callback, Function);

      userIds.forEach((userId) => {

        // Find user
        const user = Meteor.users.findOne(userId);

        if (!user)
          return true;

        // Find existing unread notification to modify
        const existingData = Herald.collection.findOne({ userId, 'data.notifGroupId': notifGroupId, read: false });
        const newData = callback(existingData);

        // Remove existing notification
        Herald.collection.remove({ userId, 'data.notifGroupId': notifGroupId, read: false });

        // Replace with new notification
        Herald.createNotification(userId, {
          courier: 'notification',
          data: {
            ...newData,
            notifGroupId,
            timestamp: new Date(),
          }
        });

      });
    },

    removeUnreadNotification: (notifGroupId, userIds) => {
      check(notifGroupId, String);
      check(userIds, Array);

      return Herald.collection.remove({ userId: { $in: userIds }, 'data.notifGroupId': notifGroupId, read: false });
    },

    notifyCommentedOnGiveaway: (giveawayId, commenterId) => {
      check(giveawayId, Match._id);
      check(commenterId, Match._id);

      const giveaway = Giveaways.findOne(giveawayId);

      if (!giveaway)
        return;

      Meteor.call('upsertNotifications', giveawayId, [ giveaway.userId ], (existingData) => {
        const metadata = existingData ? existingData.data.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== commenterId) : [];
        newUserIds.unshift(commenterId);

        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `New comment on your giveaway`,
          body: `${newUserNames} commented on ${giveaway.title}.`,
          avatar: {
            type: 'user',
            val: commenterId
          },
          url: `/giveaway/${giveawayId}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyCommentedOnGiveaway:");
          console.log(error);
        }
      });
    },

    notifyModsFlaggedComment: (commentId, flaggerId) => {
      check(commentId, Match._id);
      check(flaggerId, Match._id);

      const comment = GiveawayComments.findOne(commentId);
      const giveaway = Giveaways.findOne(comment.giveawayId);

      if (!comment || !giveaway)
        return;

      const modsAdminsUserIds = RolesHelper.findModsOrAdmins().map(user => user._id);

      Meteor.call('upsertNotifications', commentId, modsAdminsUserIds, (existingData) => {
        const metadata = existingData ? existingData.metadata : null;
        const newUserIds = metadata ? metadata.userIds.filter(userId => userId !== flaggerId) : [];
        newUserIds.unshift(flaggerId);
        const newUserNames = aggregateUserNames(newUserIds);

        return {
          title: `Comment requires review`,
          body: `${newUserNames} has flagged a comment on ${giveaway.title}.`,
          avatar: {
            type: 'icon',
            val: {
              icon: 'flag',
              color: '#d23726'
            }
          },
          url: `/giveaway/${giveaway._id}`,
          metadata: {
            userIds: newUserIds
          },
        };
      }, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyModsFlaggedComment:");
          console.log(error);
        }
      });
    },

    unnotifyModsFlaggedComment: (commentId) => {
      check(commentId, Match._id);

      const modsAdminsUserIds = RolesHelper.findModsOrAdmins().map(user => user._id);

      Meteor.call('removeUnreadNotification', commentId, modsAdminsUserIds, (error, result) => {
        if (error) {
          console.log("Error upserting notification in notifyModsFlaggedComment:");
          console.log(error);
        }
      });
    },

  });
}