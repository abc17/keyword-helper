
const { writeFileSync } = require('fs');
const multiparty = require('multiparty');

exports.handler = async (event) => {
    if (event.httpMethod !== 'POST') {
        return { statusCode: 405, body: 'Method Not Allowed' };
    }

    const form = new multiparty.Form();

    return new Promise((resolve) => {
        form.parse(event, (err, fields, files) => {
            if (err) {
                return resolve({ statusCode: 500, body: 'File parse error' });
            }

            const file = files.file[0];
            const content = require('fs').readFileSync(file.path, 'utf8');
            writeFileSync('/tmp/keywords.csv', content);

            return resolve({ statusCode: 200, body: 'File saved' });
        });
    });
};
