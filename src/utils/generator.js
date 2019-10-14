const Steps = require('cli-step');
const Spinner = require('cli-spinner').Spinner;
const { execSync, exec, spawn } = require('child_process');
const path = require('path');
const fs = require('fs-extra');
const chalk = require('chalk');
const download = require('download-git-repo');
const owner = 'YSMJ1994';

function downloadFromGithub(owner, name, dest) {
	return new Promise((resolve, reject) => {
		download(`github:${owner}/${name}`, dest, {}, function(err) {
			if (err) {
				reject(err);
			} else {
				resolve();
			}
		});
	});
}

const tempProjects = {
	ts: {
		scss: 'react-ui-temp-ts',
		less: ''
	},
	js: {
		scss: 'react-ui-temp-js',
		less: ''
	}
};

async function generator({ name, ts, preprocessor, pkg }) {
	const targetDir = path.resolve(process.cwd(), name);
	if (fs.existsSync(targetDir)) {
		console.log(`目录 ${chalk.red(name)} 已存在！`);
		return;
	} else {
		fs.ensureDirSync(targetDir);
	}
	console.log('Installing packages. This might take a couple of minutes.');
	const spin = new Spinner('downloading... ');
	spin.setSpinnerString(18);
	spin.start();
	let tempName = tempProjects[ts ? 'ts' : 'js'][preprocessor];

	// 下载模板项目至目标目录
	await downloadFromGithub(owner, tempName, targetDir);
	spin.stop(true);
	console.log(chalk.green('download success！'));
	console.log();
	execSync(`cd ${name} && ${pkg} install`, {
		stdio: 'inherit'
	});
	console.log();
	console.log('Initialized a git repository.');
	console.log();
	execSync(`cd ${name} && git init`);
	// 修改pkg name
	const targetPkgPath = path.resolve(targetDir, 'package.json');
	const targetPkg = require(targetPkgPath);
	targetPkg.name = name;
	await fs.writeJSON(targetPkgPath, targetPkg, { spaces: 2 });
	console.log(`Success! Created ${name} at ${targetDir}`);
	console.log('Inside that directory, you can run several commands:');
	console.log();
	console.log(chalk.cyan(`  ${pkg} start`));
	console.log(`    Starts the development server.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg} build`));
	console.log(`    Bundles the library into static files for production.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg} test`));
	console.log(`    Starts the test runner.`);
	console.log();
	console.log('We suggest that you begin by typing:');
	console.log();
	console.log(`  ${chalk.cyan('cd')} ${name}`);
	console.log(chalk.cyan(`  ${pkg} start`));
	console.log();
	console.log('Happy hacking!');
}

module.exports = generator;
