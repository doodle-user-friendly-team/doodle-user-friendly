# Doodle User Friendly
To build and run, activate virtual environment on doodle_env:

- If on Linux/MacOS:
    ```{bash}
    source ./doodle_env/bin/activate
    ```

- If on Windows:
    ```{bash}
    ./doodle_env/bin/Activate.ps1
    ```
    If you don't have permission to activate Powershell scripts, run this command first:
    ```{ps}
    Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
    ```

Then start both django and react servers:

- For Django:
    
    ```{bash}
    python doodle_django/manage.py runserver
    ```

- For React:

    ```{bash}
    cd doodle_django/doodle_react/
    npm start
    ```

    If you need to add new dependencies:

    ```{bash}
    cd doodle_django/doodle_react/
    npm install
    ```