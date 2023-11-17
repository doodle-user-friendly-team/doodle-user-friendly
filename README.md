# Doodle User Friendly

To build and run, first install dependencies:

- For Django:
    
    1. (First time) Create your virtual environment and activate it:
        ```{bash}
        python -m venv env
        # On Linux/MacOS
        source ./env/bin/activate
        # On Windows
        ./env/bin/Activate.ps1
        ```
    2. Install any new python dependency found on the `requirements.txt` file in your virtual environment:
        ```{bash}
        pip install -r requirements.txt
        ```

- For React:

    ```{bash}
    cd doodle_django/doodle_react/
    npm install
    ```

Then start both Django and React servers:

- For Django:
    
    ```{bash}
    python doodle_django/manage.py runserver
    ```

- For React:

    ```{bash}
    cd doodle_django/doodle_react/
    npm start
    ```

## Reminder for Development 

If you need to add/update/remove python dependencies, please update the `requirements.txt` file:
```{bash}
#On Linux/MacOS
pip freeze > requirements.txt
#On Windows
pip freeze | Out-File -FilePath requirements.txt
```

For testing with pytest, remember to call it inside the `doodle_django` parent folder:
```{bash}
cd doodle_django
pytest
```

## Generate dummy data for Development 

Replace N with the desired number of items to generate

```{bash}
python doodle_django/manage.py -c N
```