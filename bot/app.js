const app = require('./config/server')
const port = process.env.BOT_PORT

app.listen(port, () => console.log(`Servidor online na porta ${port}`))
