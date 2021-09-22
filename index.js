const fastify = require('fastify')({
    logger: true
})

const routes = require("./routes/contractRoutes")

routes.forEach((route, index) => {
    fastify.route(route)
})

const PORT = process.env.PORT || 3000;

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