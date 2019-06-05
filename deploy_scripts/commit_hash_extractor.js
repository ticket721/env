const line = process.argv[2];

const match = /^.([0-9a-fA-F]{7})[0-9a-fA-F]{33}.+$/.exec(line);

process.stdout.write(match[1]);
