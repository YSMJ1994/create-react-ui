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
	ts: false,
	preprocessor: '',
	pkg: ''
};
program
	.name(pkg.name)
	.version(pkg.version)
	.arguments('[projectName]')
	.option('-t, --typescript', 'enable typescript', function() {
		config.enabledTs = true;
	})
	.option('-p, --preprocessor [preprocessor]', 'css preprocessor. (todo...)', function(cssPre) {
		config.preprocessor = cssPre;
	})

	.option('-g, --package [package]', 'package manager [yarn | npm]', function(pkg) {
		console.log('pkg', pkg);
		if (pkg && pkg !== 'yarn' && pkg !== 'npm') {
			console.log(chalk.red('package must be "yarn" or "npm"'));
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
	if(!/^[a-z\-_]+$/.test(config.name)) {
		console.error(`Project names can only be composed of lowercase letters or -_`)
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
	console.log('config', chalk.green('package manager'), ': ', config.pkg);
	console.log('config', chalk.green('typescript'), ': ', config.ts ? 'enabled' : 'disabled');
	// 生成cru.config.js配置文件
	const configPath = path.resolve(targetDir, 'cru.config.js');
	const configContent = `module.exports = {
  output: {
    doc: 'build-doc',
    library: 'build-library'
  },
  static: {
    doc: 'public',
    library: 'libraryStatic',
  },
  src: {
    doc: 'doc',
    library: 'components'
  },
  cssPreprocessor: ${JSON.stringify(config.preprocessor)},
  typescript: ${JSON.stringify(config.ts)},
  pkg: ${JSON.stringify(config.pkg)}
}\n`;
	await fs.writeFile(configPath, configContent);
	console.log(`generate cru config file success: [ ${chalk.green(configPath)} ]`);
	console.log();
	await generator(config);
}
