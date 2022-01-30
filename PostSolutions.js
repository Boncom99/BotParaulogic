const { TwitThread } = require("twit-thread");
const schedule = require("node-schedule");
const config = require("./config");
const date = require("date-and-time");
let rule = new schedule.RecurrenceRule();
function json2array(json) {
	var result = [];
	var keys = Object.keys(json);
	keys.forEach(function (key) {
		result.push(json[key]);
	});
	return result;
}
function TodayDate() {
	let ts = Date.now();
	let now = new Date(ts);
	return date.format(now, "DD/MM/YY").toString();

	// prints date & time in YYYY-MM-DD format
}

async function Tweet(Solutions) {
	const T = new TwitThread(config);
	const NumSolucions = Solutions.length;
	const MaxLenght = 280;
	var list = []; //separate the solutions into  strings of max 280 of lenght and added into the list
	var str = "";
	for (let i = 0; i < Solutions.length; i++) {
		if (str.length + Solutions[i].length + 2 <= MaxLenght) {
			if (str.length > 0) {
				str += ", ";
			}
			str += Solutions[i];
		} else {
			list.push(str);
			str = "";
			str += Solutions[i];
		}
	}
	if (str.length > 0) {
		list.push(str);
	}
	console.log(list.length);
	const dia = TodayDate();
	postText =
		"🚨 Spoiler!\nLes " +
		NumSolucions +
		" solucions del #paraulogic d'avui dia " +
		dia +
		" 👇";
	var Post = [];
	Post.push({ text: postText });
	for (let i = 0; i < list.length; i++) {
		var aux = new Object();
		aux.text = list[i];
		Post.push(aux);
	}
	console.log(Post);
	await T.tweetThread(Post);
}
async function getSolutions() {
	const puppeteer = require("puppeteer");
	const browser = await puppeteer.launch();
	const page = await browser.newPage();
	await page.goto("https://vilaweb.cat/paraulogic/");

	const data = await page.evaluate(() => {
		return Promise.resolve({
			//letters: t.l,
			words: t.p,
		});
	});
	const obj = json2array(data.words);
	obj.sort(function (a, b) {
		return (
			b.length - a.length || // sort by length, if equal then
			a.localeCompare(b)
		); // sort by dictionary order
	});
	Tweet(obj);
	browser.close();
}
getSolutions();
/*rule.tz = "Europe/Madrid";
rule.second = 0;
rule.minute = 20;
rule.hour = 01;
const job = schedule.scheduleJob(rule, () => {
	getSolutions();
});
job.schedule();
*/
