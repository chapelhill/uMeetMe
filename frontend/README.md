# Backend URL Scheme

GET https://umeetupback-jasonqaio.c9.io/users

- Gets a list of users in JSON format

    { 'loluser': {'first_name': 'Dick', 'last_name': 'Kraft', age: 42},
      .. }
     
PUT https://umeetupback-jasonqaio.c9.io/users/(username)

- Creates a new user
- Send a JSON body which contains the information about the user