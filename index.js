const puppeteer = require("puppeteer");
const readlineSync = require("readline-sync");
const chalk = require('chalk');
const ora = require('ora');

const spinner = ora({
	spinner: 'dots',
});

const log = (title, value) => {
  console.log(`${chalk.bold.green(title + ': ')} ${value}`);
};

(async () => {
  console.clear();
  const fii = readlineSync.question('Digite o codigo do fundo imobiliario: ');
  spinner.start(`Buscando dados do FII ${fii.toUpperCase()}`);
  const url = `https://www.fundsexplorer.com.br/funds/${fii}`;

  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.goto(url);
  // await page.screenshot({ path: "example.png" });

  const result = await page.evaluate(() => {
    const indicators = document.getElementsByClassName("indicator-value");
    const price = document.getElementsByClassName("price")[0].innerHTML.trim();
    const title = document
      .getElementsByClassName("MsoNormal")[0]
      .getElementsByTagName("span")[0]
      .innerText.trim();

    return {
      title,
      price,
      liquidity: indicators[0].innerHTML.trim(),
      lastYield: indicators[1].innerHTML.trim(),
      yield: indicators[2].innerHTML.trim(),
      pvp: indicators[indicators.length - 1].innerHTML.trim(),
    };
  });

  spinner.stop();

  log('FII', result.title);
  log('Última cotação', result.price);
  log('Liquidez diária', result.liquidity);
  log('Último Rendimento', result.lastYield);
  log('Dividend Yield', result.yield);
  log('P/VP', result.pvp);

  await browser.close();
})();
