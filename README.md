# Doodle User Friendly
To build and run, activate virtual environment on doodle_env:

```{bash}
source ./doodle_env/bin/activate
```

Then start both django and react servers:

```{bash}
\\ For Django
python doodle_django/manage.py runserver

\\ For React
cd doodle_react/
npm start
```