const express = require('express')
const api = require('./api/pizzas')
const app = express()

const port = 3001

app.use("/api/pizzas", api)

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})