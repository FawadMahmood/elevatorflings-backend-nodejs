# elevatorflings-backend-nodejs
 MongoDB, GraphQL, TypeScript



#Mutations

**Register User**

```
mutation {
  addUser(
    input: {
      email: "fawad.mahmood@outlook.com"
      username: "fawadmahmood"
      name: "Fawad Mahmood Siddiqui"
      provider: "self"
      location: { type: "Point", coordinates: [10.245, 2.366] }
      phone: "923060023003"
      password:"qwertyuiop"
    }
  ) {
    user {
      _id
      name
      email
      username
      phone{
        phone
        primary
      }
      location {
        coordinates
      }
    }
    error{
      message,
      code
    }
  }
}


```

**Authenticate User**

```
query Signin($email: String!, $password: String!) {
  signin(email: $email, password: $password) {
    user {
      _id
      name
      email
      username
      phone{
        phone
        primary
      }
      location {
        coordinates
      } 
      accessToken
    }
     error{
      message,
      code
    }
    }
  }
}
```

