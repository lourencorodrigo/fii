const ora = require('ora');

const spinner = ora({
	spinner: 'dots',
	text: 'Buscando dados.'
}).start();

setTimeout(() => {
	spinner.stop();
}, 5000);