var entities = require('v1/entities');
var env = require('v1/environment');
var dater = require('v1/date-time');

exports.rule = entities.Issue.onChange({
    title: "Start timer",
    action: function (ctx) {
        var issue = ctx.issue,
            fs = issue.fields;

        if (fs.isChanged('State')) {

            if (fs.State.presentation == "In Progress") {
                env.message('Timer time started on: ' + dater.format(new Date().getTime(), 'Y-MM-d H:mm:s'));
                fs['Timer time'] = new Date().getTime();
            }
        }
    }
});