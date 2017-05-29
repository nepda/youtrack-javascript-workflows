var entities = require('v1/entities');
var env = require('v1/environment');

exports.rule = entities.Issue.onChange({
    title: 'Timer stop',
    action: function (ctx) {
        var issue = ctx.issue,
            f = issue.fields;

        if (!f.isChanged('State')) {
            return;
        }

        if (!f.oldValue('State')) {
            return;
        }

        if (f.oldValue('State').presentation != 'In Progress') {
            return;
        }

        if (!f['Timer time']) {
            env.message('Timer for issue was not started!');
            return;
        }

        var timerTime = f['Timer time'],
            diff = new Date().getTime() - timerTime,
            seconds = (diff - diff % 1000) / 1000,
            minutes = (seconds - seconds % 60) / 60,
            hours = (minutes - minutes % 60) / 60,
            days = (hours - hours % 24) / 24;

        minutes = minutes % 60;
        hours = hours % 24;

        // Just add 1 minute as a minimum.
        minutes++;

        if (days + hours + minutes <= 0) {
            env.message('You\'ve worked less then a minute. No work time added.');
            return;
        }

        if (days !== 0) {
            env.message('Worktime: ' + days + ' day(s), ' + hours + ' hour(s), ' + minutes + ' minute(s).)');
        } else if (hours !== 0) {
            env.message('Worktime: ' + hours + ' hour(s), ' + minutes + ' minute(s).)');
        } else {
            env.message('Worktime: ' + minutes + ' minute(s).)');
        }

        issue.applyCommand('add work Today ' + days + 'd' + hours + 'h' + minutes + 'm Automatic time tracking');

        f['Timer time'] = null;
    },
    requirements: {
        'Timer time': {
            type: entities.Field.dateType
        }
    }
});
