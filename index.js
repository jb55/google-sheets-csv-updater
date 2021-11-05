const {google} = require('googleapis');
const sheets = google.sheets('v4');
const path = require('path')
const fs = require('fs')

const SCOPES = [ "https://www.googleapis.com/auth/spreadsheets" ];

// credentials.json is a service credentials json. much easier than
// dealing with oauth tokens
function authorize(scopes) {
	const keyFile = "credentials.json"
	return new google.auth.GoogleAuth({ keyFile, scopes })
}

function make_paste_request(data, sheetId)
{
	const rowIndex = 0
	const columnIndex = 0
	const coordinate = { sheetId, rowIndex, columnIndex }
	const type = "PASTE_NORMAL"
	const delimiter = ","
	const pasteData = { coordinate, data, type, delimiter }

	return { pasteData }
}

function file_data(file)
{
	return new Promise((resolve, reject) => {
		fs.readFile(file, (err, data) => {
			if (err) reject(err)
			else resolve(data.toString('utf8'))
		})
	})
}

function make_clear_request(sheetId)
{
	const range = { sheetId }
	const fields = "*"
	const updateCells = { range, fields }
	return { updateCells }
}

async function make_request(spreadsheetId, reqs)
{
	const datas = await Promise.all(reqs.map(r => file_data(r.file)))
	const clear_reqs = reqs.map(r => make_clear_request(r.sheetId))

	const paste_reqs = reqs.map((r,i) =>
		make_paste_request(datas[i], r.sheetId))

	const requests = clear_reqs.concat(paste_reqs)

	const auth = authorize(SCOPES);
	const resource = { requests }
	const request = { spreadsheetId, resource, auth };

	try {
		const response = (await sheets.spreadsheets.batchUpdate(request)).data;
		console.log(JSON.stringify(response, null, 2));
	} catch (err) {
		console.error(err);
	}
}

function usage()
{
	const name = path.basename(process.argv[1])
	console.log("usage: %s [spreadsheet_id] [<sheetid>_file.csv]...", name)
	process.exit(0)
}

async function main () {
	const args = process.argv.slice(2)
	if (args.length === 0)
		return usage()

	const spreadsheetId = args[0]

	const reqs = args.slice(1).map(file => { 
		let [sheetId] = path.basename(file).split("_")
		return {sheetId, file}
	})

	await make_request(spreadsheetId, reqs)
}

main();

