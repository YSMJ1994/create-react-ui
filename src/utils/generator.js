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
	ts: 'react-ui-temp-ts',
	js: 'react-ui-temp-js'
};

async function resolveDemoName(targetDir, name) {
	const demoDir = path.resolve(targetDir, 'components/Button/demo');
	if (!fs.existsSync(demoDir)) {
		return;
	}
	const children = await fs.readdir(demoDir);
	for (let i = 0, len = children.length; i < len; i++) {
		const childPath = path.resolve(demoDir, children[i]);
		let content = await fs.readFile(childPath, 'utf-8');
		content = content.replace(/unknown/g, name);
		await fs.writeFile(childPath, content);
	}
}

async function copyReadme(targetDir) {
	const src = path.resolve(__dirname, '../../project_readme.md');
	const dest = path.resolve(targetDir, 'README.md');
	await fs.copy(src, dest);
}

async function generator({ name, ts, preprocessor, pkg }) {
	const targetDir = path.resolve(process.cwd(), name);
	if (fs.existsSync(targetDir)) {
		console.log(`目录 ${chalk.red(name)} 已存在！`);
		return;
	} else {
		fs.ensureDirSync(targetDir);
	}
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
  enableBabelImport: true,
  cssPreprocessor: ${JSON.stringify(preprocessor)},
  typescript: ${JSON.stringify(ts)},
  pkg: ${JSON.stringify(pkg)}
}\n`;
	await fs.writeFile(configPath, configContent);
	console.log(`generate cru config file success: [ ${chalk.green(configPath)} ]`);
	console.log();
	console.log('Installing packages. This might take a couple of minutes.');
	const spin = new Spinner('downloading... ');
	spin.setSpinnerString(18);
	spin.start();
	let tempName = tempProjects[ts ? 'ts' : 'js'];

	// 下载模板项目至目标目录
	await downloadFromGithub(owner, tempName, targetDir);
	spin.stop(true);
	console.log(chalk.green('download success！'));
	// 修改demos中库别名的引用
	await resolveDemoName(targetDir, name);
	// 复制readme
	await copyReadme(targetDir);
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
	// 修改tsconfig.json
	const targetTsConfigPath = path.resolve(targetDir, 'tsconfig.json')
	if (ts && fs.existsSync(targetTsConfigPath)) {
		const config = require(targetTsConfigPath);
		config.compilerOptions.paths = {
			'toolSrc/*': ['node_modules/react-ui-scripts/src/*'],
			'components/*': ['./components/*'],
			[name]: ['node_modules/react-ui-scripts/assets/components/comps.js'],
			[`${name}/*`]: ['./components/*']
		};
		await fs.writeJSON(targetTsConfigPath, config, { spaces: 2 });
	}
	console.log(`Success! Created ${name} at ${targetDir}`);
	console.log('Inside that directory, you can run several commands:');
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} start`));
	console.log(`    Starts the development server.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} build`));
	console.log(`    Bundles the doc & the library into static files for production.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} build-doc`));
	console.log(`    Bundles the doc into static files for production.`);
	console.log();
	console.log(chalk.cyan(`  ${pkg}${pkg === 'npm' ? ' run' : ''} build-library`));
	console.log(`    Bundles the library into static files for production.`);
	console.log();
	console.log('We suggest that you begin by typing:');
	console.log();
	console.log(`  ${chalk.cyan('cd')} ${name}`);
	console.log(chalk.cyan(`  ${pkg} start`));
	console.log();
	console.log('Happy hacking!');
}

module.exports = generator;
