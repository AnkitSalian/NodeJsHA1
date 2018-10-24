var env = {};

//Create a default environment
env.default = {
    'port' : 3000,
    'envName' : 'default'
};

//Create a development environment
env.development = {
    'port' : 4000,
    'envName' : 'development'
};

//Create a production environment
env.production = {
    'port' : 5000,
    'envName' : 'production'
};

var chosenEnv = typeof(process.env.NODE_ENV)=='string' ? process.env.NODE_ENV : '';
var trimChosenEnv = chosenEnv.replace(' ','');

var envToExport = typeof(env[chosenEnv])=='object' ? env[chosenEnv] : env.default;

module.exports = envToExport;