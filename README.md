
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
