const { exec } = require('child_process');
var argv = require('minimist')(process.argv.slice(2));

var options = {
    proxyPort: 1080,
    sshHost: "",
    sshPort: 22,
    sshUser: "",
    controlSocket: "/tmp/sshtunnel"
}

if ( argv.p != undefined ) {
    options.proxyPort = argv.p
}

if ( argv.host != undefined ) {
    options.sshHost = argv.host
}

if ( argv.hp != undefined ) {
    options.sshPort = argv.hp
}

if ( argv.l != undefined ) {
    options.sshUser = argv.l
}

if ( argv.c != undefined ) {
    options.controlSocket = argv.c
}

exec(`ssh -f -N -M -S ${options.controlSocket} -D ${options.proxyPort} ${options.sshUser}@${options.sshHost} -p ${options.sshPort}`, (err, stdout, stderr) => {
        
    if (err) {
        // node couldn't execute the command
        console.log("Fatal Error: Can not operate connection command.")
        return;
    }

    var net = require('net');

    // parse "80" and "localhost:80" or even "42mEANINg-life.com:80"
    var addrRegex = /^(([a-zA-Z\-\.0-9]+):)?(\d+)$/;

    var addr = {
        from: addrRegex.exec("80"),
        to: addrRegex.exec(options.proxyPort)
    };

    if (!addr.from || !addr.to) {
        console.log('Usage: <from> <to>');
        return;
    }

    net.createServer(function(from) {
        var to = net.createConnection({
            host: addr.to[2],
            port: addr.to[3]
        });
        from.pipe(to);
        to.pipe(from);
    }).listen(addr.from[3], addr.from[2]);
    if ( stderr != "" ) {
        console.log(`Error: ${stderr}`);
    }

    console.log(`Listining on: 127.0.0.1:${options.proxyPort}`)
});