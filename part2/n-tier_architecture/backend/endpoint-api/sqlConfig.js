var dbconfig = {
    development: {
        server: '192.168.214.129',
        database:'team5_engce301_db',
        user:'team5',
        password:'P@ssw0rd',
        port: 1433,
        options:{
            encript: true,
            setTimeout: 12000,
            enableArithAbort: true,
            trustServerCertificate: true,
            trustedconnection:  true,
            instancename:  '192.168.56.106'  // SQL Server instance name
        }
    },
    production: {
        server: '10.21.47.33', //CE Lab Server
        database:'team5_engce301_db',
        user:'team5',
        password:'P@ssw0rd',
        port: 1433,
        options:{
            encript: true,
            setTimeout: 12000,
            enableArithAbort: true,
            trustServerCertificate: true,
            trustedconnection:  true,
            instancename:  '10.21.47.33'  // SQL Server instance name
        }
    },

};

module.exports = dbconfig;
