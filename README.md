
# Python-React-ETL

A brief description of how to run the project

### Clone the project
1. 1. Open a terminal 
2. Clone repo git clone ```https://github.com/Frd0mF/Python-react-etl.git```

### start the backend
1. Open a terminal 
2. Change directory ```cd backend```
3. Create a virtual environment 
    ```python3 -m venv .venv```
4. Activate the virtual environment ```. .venv/bin/activate```
5. Install dependencies ```pip install -r requirements.txt```
6. Apply migrations ```python3 manage.py migrate```
7. Start the server ``` python3 manage.py runserver```

### start the frontend
1. Open a terminal 
2. Change directory ```cd frontend```
3. Install dependencies ```npm i```
4. Create a file called .env and add this value
    ```NEXT_PUBLIC_BACKEND_URL='http://127.0.0.1:8000'``` 
4. Start the server ```npm run dev```



