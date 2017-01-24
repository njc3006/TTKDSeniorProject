# TTKDSeniorProject
A TTKD Student Management System

## Installing and Running
### Django API
To Install and run this application, do the following:

1. Install Python 3.5.2
2. Clone this repo.
3. `cd` into the topmost `ttkd_api/` directory of the repo.
4. Run `pip install -r requirements.txt`
5. Run `python manage.py migrate` to initialize your database.
6. Run `python manage.py runserver`
7. Navigate to `localhost:8000/api`

This project is set up with PyLint. To run the linter, cd to `ttkd_api/` and run `pylint ttkd_api/`.

### AngularJS App
To install and run the AngularJS app, do the following:

1. Install Node
2. run `npm install -g gulp` to install Gulp (our build system)
3. run `npm install -g bower` to install Bower (our ui dependency manager)
4. `cd` into the `ttkd_ui` folder.
5. run `npm install`
6. run `bower install`
7. run `gulp` to build the project and run the server.

### Using the import script
You must either be in the scripts folder or the ttkd_api folder when you run the script
You must also have all 4 of the required json files in the folder you are executing the script from (these come from the mongo dump of the old system):

1. students.json
2. attendances.json
3. classes.json
4. programs.json

there are 2 possible additional options when running the script:

1. belts - Adds default belts into the import. (This is soon being deprecated to be a default) 
2. mask - Removes any sensitive personal data when loading in the old files. If used in conjunction with the belts flag it will also generate fake relationships of belts and stripes to persons in the import.

`python import_json.py <belt|stripe|belts|stripes> <mask>`

### Building a Release
To build a release for the project, setup a unix-like environment with the following dependencies installed (In addition to the dependencies needed to build the project):

- unzip
- zip

Then, issue the following commands:

```
cd scripts
./build-release.sh
```

- If you would like to start with a specific data set, export your data using `python manage.py dumpdata > data.json`, then put `data.json` in the root project directory.
- If you change the requirements.txt of this project, you will need to extract `scripts/python-dist.zip`, copy and paste your python libraries you added into `python-dist/python-X.X.X-embed-amd64/Lib/site-packages`, and re-zip `python-X.X.X-embed-amd64`.
