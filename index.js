#!/usr/bin/env node
const chalk = require('chalk');
const program = require('commander');
const pkg = require('./package');
const path = require('path');
const fs = require('fs-extra');
const question = require('./src/utils/question');
const generator = require('./src/utils/generator');
let config = {
	name: '',
	enableBabelImport: '',
	ts: '',
	preprocessor: '',
	pkg: ''
};
process.on("unhandledRejection", err => {
	throw err;
});
program
	.name(pkg.name)
	.version(pkg.version)
	.arguments('[projectName]')
	.option('-t, --typescript', 'enable typescript', function() {
		config.ts = true;
	})
	.option('-p, --preprocessor [preprocessor]', 'css preprocessor [sass | scss | less]', function(cssPre) {
		if(cssPre && !/^(less|sass|scss)$/.test(cssPre)) {
			console.log(chalk.red('css preprocessor just supported "sass"、"scss" or "less"'));
			process.exit(-1);
		}
		config.preprocessor = cssPre;
	})
	.option('-g, --package [package]', 'package manager [yarn | npm]', function(pkg) {
		console.log('pkg', pkg);
		if (pkg && pkg !== 'yarn' && pkg !== 'npm') {
			console.log(chalk.red('package just supported "yarn" or "npm"'));
			process.exit(-1);
		}
		config.pkg = pkg;
	})
	.action(execute)
	.parse(process.argv);

async function execute(projectName) {
	config.name = projectName;
	if (!config.name) {
		config.name = await question('project name?', 'input');
	}
	if(!/^[a-z\-_@]+$/.test(config.name)) {
		console.error(`Project names can only be composed of lowercase letters or -_@`)
		config.name = '';
		await execute()
		return 
	}
	if (!config.preprocessor) {
		config.preprocessor = await question('css preprocessor?', 'list', {
			choices: [
				{
					name: '1) sass & scss',
					value: 'scss'
				},
				{
					name: '2) less',
					value: 'less'
				}
			]
		});
	}
	if(config.ts === '') {
		config.ts = await question('enable typescript?', 'confirm');
	} 
	if(config.enableBabelImport === '') {
		config.enableBabelImport = await question('enable babel-plugin-import supported generated outputs?', 'confirm');
	} 
	if (!config.pkg) {
		config.pkg = await question('package manager?', 'list', {
			choices: [
				{
					name: '1) yarn',
					value: 'yarn'
				},
				{
					name: '2) npm',
					value: 'npm'
				}
			]
		});
	}
	const targetDir = path.resolve(process.cwd(), config.name);
	console.log('Creating a new React Component Library in ', chalk.green(targetDir), '.');
	console.log();
	console.log('config', chalk.green('css preprocessor'), ': ', config.preprocessor);
	console.log('config', chalk.green('babel-plugin-import outputs support'), ': ', config.enableBabelImport ? 'enabled' : 'disabled');
	console.log('config', chalk.green('package manager'), ': ', config.pkg);
	console.log('config', chalk.green('typescript'), ': ', config.ts ? 'enabled' : 'disabled');
	await generator(config);
}
