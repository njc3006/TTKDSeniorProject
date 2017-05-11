# TTKDSeniorProject
A TTKD Student Management System

## Installing and Running

### Custom Waiver
Our system allows for martial arts studios to customize the content of the waiver screen during registration. To do so
follow the following steps:

1. Create a file called `waiver.txt` in the `ttkd_api/static` folder.
2. Edit the new file so that it contains the text you want.
3. Be sure to save any changes made.

**Note**: In order to see any updated text, you may need to clear your browser cache

### Django API
To Install and run this application, do the following:

1. Install Python 3.5.2
2. Clone this repo.
3. `cd` into the topmost `ttkd_api/` directory of the repo.
4. Run `pip install -r requirements.txt`
5. Run `python manage.py migrate` to initialize your database.
6. Run `python manage.py runserver_plus --cert .\cert`
7. Navigate to `localhost:8000/api`

This project is set up with PyLint. To run the linter, cd to `ttkd_api/` and run `pylint ttkd_api/`.

### AngularJS App
To install and run the AngularJS app, do the following:

1. Install Node
2. Install Git
3. run `npm install -g gulp` to install Gulp (our build system)
4. run `npm install -g bower` to install Bower (our ui dependency manager)
5. `cd` into the `ttkd_ui` folder.
6. run `npm install`
7. run `bower install`
8. run `gulp` to build the project and run the server.

### Using the import script
You must either be in the scripts folder or the ttkd_api folder when you run the script
You must also have all 4 of the required json files in the folder you are executing the script from (these come from the mongo dump of the old system):

1. students.json
2. attendances.json
3. classes.json
4. programs.json

there are 2 possible additional options when running the script:

1. nobelts - Does not add default belts into the import.
2. mask - Removes any sensitive personal data when loading in the old files. This flag will also generate fake relationships of belts and stripes to persons in the import unless one of the variations of the nobelts flag is used.

`python import_json.py <nobelts> <mask>`

### Testing

## Setup
- Update node to v6.9.5
- Re-initialize your environment: `npm rebuild node-sass`
- Install dependencies: `npm install`
- Install protractor: `npm install -g protractor`
- Update webdrivers: `./node_modules/gulp-protractor/node_modules/protractor/bin/webdriver-manager update`

## Using Protractor Globally (Recommended)
- Run your API and UI projects normally
- Run protractor tests from the `ttkd_ui` directory by running `protractor protractor.config.js`

## Using Gulp-Protractor (Proceed at your own risk)
- Start your API
- Run protractor tests from the `ttkd_ui` directory by running `gulp test`

#### Creating Tests

To create a new test, just create the file in the same folder as the functionality you will be testing, and make the extension `.test.js`. Gulp will automatically run the test.

### Building a Release
To build a release for the project, setup a unix-like environment with the following dependencies installed (In addition to the dependencies needed to build the project):

- unzip
- zip

The easiest way to do this is to first [download and install Git Bash](https://git-scm.com/downloads). Then, install [GNU on Windows](https://github.com/bmatzelle/gow/wiki).

Then, issue the following commands:

```
cd scripts
./build-release.sh
```

- If you would like to start with a specific data set, export your data using `python manage.py dumpdata > data.json`, then put `data.json` in the root project directory.
  - Alternatively, you can run the `scripts/import_json.py` script prior to building a release to preconfigure your data.
- If you change the requirements.txt of this project, you will need to extract `scripts/python-dist.zip`, copy and paste your python libraries you added into `python-dist/python-X.X.X-embed-amd64/Lib/site-packages`, and re-zip `python-X.X.X-embed-amd64`.
