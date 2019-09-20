const inquirer = require('inquirer');

function question(message, type = 'input', config = {}) {
	const question = [
		{
			type,
			name: 'result',
			message,
			...config
		}
	]
	return inquirer.prompt(question).then(function ({result}) {
		return result
	})
}

module.exports = question
