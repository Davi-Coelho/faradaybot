const app = require('./config/server')
const port = 3000

app.listen(port, () => console.log(`Servidor online na porta ${port}`))
