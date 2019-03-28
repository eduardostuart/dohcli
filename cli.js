#!/usr/bin/env node

const program = require('commander');
const dns = require('google-dns');
const chalk = require('chalk');
const Table = require('cli-table');

program
  .version('0.1.0')
  .option('-t, --type <type>', 'Resource record (RR)');

program.parse(process.argv);

if (program.args.length < 1) {
  console.log(chalk.red(`
Invalid domain
`));
  process.exit(1);
}

(async function (domain, type = 'any') {
  try {
    const res = await dns(domain, type);

    const items = res.Answer || res.Authority;
    const table = new Table({ head: ['name', 'type', 'TTL', 'data'] });
    items.forEach(item => table.push([item.name, item.type, item.TTL, item.data]));

    console.log(table.toString());
  } catch (e) {
    console.log(chalk.red(`
Ops..
Something went wrong
${e.message}
`))
  }
}(program.args[0], program.type));
