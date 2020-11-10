## outside
- replicate current database schema to mysql via dbDiagram

## inside
  NOTE explain database column naming convection
- install mysql dependency
- create connection/dbConnection.js & initiate mysql
- remove all lowdb codes & dependency
- remove all models
- remove object shaper
- add some data to users

### user
- finish /login
  - install lodash
  - create chainWhere()
  NOTE explain promises
- npm install uuid
- finish /register
  - add createInsertColumns()

### stores
- finish /stores (add)
    NOTE explain camelCase vs snake_case
  - install humps
- finish /stores (get)
- finish /stores (edit)
  - add chainSet()
- finish /stores (delete)

### errors
- handle not found column
- handle offload data
- handle empty data

