const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const AdminUsersRouter = require('./routes/adminUsers');
const AdminLoginRouter = require('./routes/adminLogin');
const AdminMissionsRouter = require('./routes/adminMission');
const AdminVehiclesRouter = require('./routes/adminVehicle');
const AdminRolesRouter = require('./routes/adminRole');
const MissionSearch = require('./routes/missionSearch');

app.use(bodyParser.json());
app.use(
    bodyParser.urlencoded({
        extended: true,
    })
);
app.use(cors())

app.get('/', (req, res) => {
    res.json({'message': 'ok'});
})

app.use('/', AdminLoginRouter);
app.use('/', MissionSearch);
app.use('/admin/user', AdminUsersRouter);
app.use('/admin/mission', AdminMissionsRouter);
app.use('/admin/vehicle', AdminVehiclesRouter);
app.use('/admin/role', AdminRolesRouter);

/* Error handler middleware */
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    console.error(err.message, err.stack);
    res.status(statusCode).json({'message': err.message});

    return;
});

app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
});