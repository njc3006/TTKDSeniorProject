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

1. nobelts - Does not add default belts into the import.
2. mask - Removes any sensitive personal data when loading in the old files. This flag will also generate fake relationships of belts and stripes to persons in the import unless one of the variations of the nobelts flag is used.

`python import_json.py <nobelt|nostripe|nobelts|nostripes> <mask>`
