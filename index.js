/*jshint forin:true, noarg:true, noempty:true, eqeqeq:true, bitwise:true, undef:true, unused:true, curly:true, browser:true, indent:4, maxerr:50 */
/*global __dirname, console, module, process, require */

var spawn = require('child_process').spawn;

var python_path = process.env.PYJINJA_PYTHON;

if (python_path === undefined) {
    console.log('Please set the PYJINJA_PYTHON environment variable before running the application.');
    process.exit();
}

var Jinja = {
    template_dir: './views/',
    render: function (view, template_vars, callback) {
        var child = spawn(python_path, [__dirname + '/pyjinja.py', JSON.stringify(template_vars), this.template_dir, view]),
            err = '',
            html = '';

        child.stdout.on('data', function (data) {
            html += data.toString();
        });

        child.stderr.on('data', function (data) {
            err += data.toString();
        });

        child.on('exit', function () {
            if (err !== '') {
                console.error(err);
            } else {
                err = null;
            }

            if (typeof callback === 'object' && typeof callback.send === 'function') {
                callback.send(html);
            } else {
                callback(err, html);
            }
        });
    },
    setTemplateDir: function (dir) {
        if (dir.match(/\/$/) === null) {
            dir += '/';
        }
        this.template_dir = dir;
    }
};

module.exports = Jinja;