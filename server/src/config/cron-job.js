var cron = require('node-cron');
const reminderService = require('../services/reminder.service');

module.exports = {
  datavant: () => {
    cron.schedule('*/5 * * * *', () => {
      console.log(
        'referralVerification running a task every 5 min------------------------>'
      );
      reminderService.referralVerification();
    });
    cron.schedule('*/2 * * * *', () => {
      console.log(
        'referralFollowup running a task every 2min ------------------------>'
      );
      reminderService.referralFollowup();
    });
    cron.schedule('*/2 * * * *', () => {
      console.log(
        'takReminder running a task every 2min ------------------------>'
      );
      reminderService.taskReminder();
    });
  },
};
