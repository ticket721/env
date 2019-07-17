const modulename = process.argv[2];

const manifest = require(`../${modulename}/package`);

process.stdout.write(manifest.version);
