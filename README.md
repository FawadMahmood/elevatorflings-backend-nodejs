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
    }
  ) {
    user {
      name
      email
      username
      phone
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

