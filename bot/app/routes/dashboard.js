module.exports = (application) => {
    application.get('/dashboard', (req, res) => {
        application.app.controllers.dashboard.dashboard(application, req, res)
    })

    application.get('/logout', (req, res) => {
        application.app.controllers.dashboard.logout(application, req, res)
    })

    application.get('/alerts', (req, res) => {
        application.app.controllers.dashboard.alerts(application, req, res)
    })

    application.post('/alerts', (req, res) => {
        application.app.controllers.dashboard.alertsPost(application, req, res)
    })
}