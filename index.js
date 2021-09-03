const fastify = require('fastify')({
    logger: true
})

const routes = require("./routes/contractRoutes")
const PORT = 3000

routes.forEach((route, index) => {
    fastify.route(route)
})

const serve = async () => {
    try {
        await fastify.listen(PORT, '0.0.0.0')
        fastify.log.info(`Server listening to PORT ${fastify.server.address().port}`)
    } catch (err) {
        fastify.log.error(err)
        process.exit(1)
    }
}

serve()