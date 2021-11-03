
# google-sheets-csv-updater

Simple script that syncs csvs to google sheets

## Usage

```
$ export SPREADSHEET_ID="18IjwDVl-IGg5CLV7k-LdcwC..."
$ node index.js $SPREADSHEET_ID 1005113952_some_report.csv 1625113952_some_report2.csv 
$ node index.js $SPREADSHEET_ID *.csv
```

The csv files must have the sheetId prefixed (eg: `1005113952_`). This is used
to update the specific sheetId in the spreadsheet. You can get both the
spreadsheetId and sheetId from the url.

## Authentication

You need a `credentials.json` which you can generate via service credentials in
Google's [Cloud Console](https://console.cloud.google.com).

Make sure to add the Sheets API to the project, the only scope used by this script is:

`https://www.googleapis.com/auth/spreadsheets`

You also need to add the service credential's email as an editor to the spreadsheet.

## Why

I wanted to upload database reports periodically without having to do too much work:

```
#!/usr/bin/env bash

set -eou pipefail

# with an ssh tunnel to prod :)
export PGHOST=127.0.0.1 PGPORT=5445 PGUSER=pguser PGPASSWORD=???? PGDATABASE=steamoji

psql --csv < session_counts.sql > 1601500676_sessions.csv
psql --csv < apprentice_report.sql > 1222747557_apprentices.csv

node index.js 18IjxDVl-IZg5CL... *.csv
```
