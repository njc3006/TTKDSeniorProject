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
2. `cd` into the `ttkd-ui` folder.
3. run `npm install`
4. run `npm install -g gulp`
