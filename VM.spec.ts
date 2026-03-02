
import { test, expect } from "@playwright/test";
//import logger from "../utils/LoggerUtil";
//import {decrypt} from "../utils/CryptojsUtil";
import * as csv from "@fast-csv/parse";
import { writeToPath } from "fast-csv";
import { isNull } from "util";
import { notEqual } from "assert";

const authFile =
	"/Users/dalevu/VM/src/config/auth.json";
const authVMFile =
	"/Users/dalevu/VM/src/config/authVMFile.json";
const certVU = "src/config/VU.pem";
const VMname = "MyBox";

const key =
	"HKEY_CURRENT_USER\\SOFTWARE\\Policies\\Chromium\\AutoSelectCertificateForUrls";
const value = "1";
const url =
	"https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fus-east-2.console.aws.amazon.com%2Fec2%2Fv2%2Fhome%3Fregion%3Dus-east-2%26state%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fec2&forceMobileApp=0";
const data = `{\\"pattern\\":\\"${url}\\",\\"filter\\":{\\"SUBJECT\\":{\\"CN\\":\\"${certVU}\\"}}}`;

const { exec } = require("node:child_process");

const envIDPW = process.env.IDPW;
const arrIDPW = envIDPW.split(',');
const envJOBID = process.env.JOBID_TN;
const arrJOBID = envJOBID.split(',');

test("Log into AWS as Root", async ({ page }) => {
	test.slow();
	await page.waitForTimeout(5000);
	await page.pause();
	try {
		await page.goto(
			"https://signin.aws.amazon.com/signin?redirect_uri=https%3A%2F%2Fus-east-2.console.aws.amazon.com%2Fec2%2Fv2%2Fhome%3Fregion%3Dus-east-2%26state%3DhashArgs%2523%26isauthcode%3Dtrue&client_id=arn%3Aaws%3Aiam%3A%3A015428540659%3Auser%2Fec2&forceMobileApp=0",
		);
	} catch (e) {
		await page
			.getByRole("link", { name: "https://aws.amazon.com/" })
			.click();
		await page
			.getByRole("button", { name: "https://aws.amazon.com/#:~:text=in%20to%20console-,Create%20account,-Adopt%20industry%2Dfirst" })
			.click();
		await page.pause();
	}
	await page.getByPlaceholder("username@example.com").fill(`${arrIDPW[0]}`);
	await page.getByRole("button", { name: "Next" }).click();
	await page.getByRole('textbox', { name: 'Password' }).fill(`${arrIDPW[1]}`);
	await page.getByTestId('signin-button').click();
	await page.waitForTimeout(10000);
	await page.getByRole('link', { name: 'Instances', exact: true }).click();
	await page.waitForTimeout(5000);
	await page.context().storageState({ path: authVMFile });
	await page.goto(
			"https://us-east-2.console.aws.amazon.com/ec2/home?region=us-east-2#Home:",
		);
});

test("Create AWS VM", async ({ browser }) => {
	test.slow();
	const context = await browser.newContext({ storageState: authVMFile });
	const page = await context.newPage();
	//get JOBID_TN(s) from environment
	const envJOBID = process.env.JOBID_TN;
	//get RowWait from environment
	const envRowWait = Number.parseInt(`${process.env.SLOWLOAD}`, 10);
	//store list of JOBID_TN in array
	/////const arrJOBID = envJOBID.split(",");
	//const len = envJOBID.length;
	const delay = (ms: number | undefined) =>
		new Promise((resolve) => setTimeout(resolve, ms));
	const objectsEqual = (o1, o2) =>
		typeof o1 === "object" && Object.keys(o1).length > 0
			? Object.keys(o1).length === Object.keys(o2).length &&
				Object.keys(o1).every((p) => objectsEqual(o1[p], o2[p]))
			: o1 === o2;

	const my_path = "xpath=/html/body/ui-view";
}
