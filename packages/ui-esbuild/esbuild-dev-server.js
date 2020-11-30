const esbuild = require('esbuild');
const path = require('path');

const esBuildConfig = {
    file: path.resolve(__dirname, './src/index.tsx');
    write: false;
}

async function startServer() {
    const service = await esbuild.startService();

    console.log('====================================');
    console.log('DEV SERVER STARTED');
    console.log('====================================');

    const res = await service.build(esBuildConfig);

    console.log(res);

    process.on('exit', function() {
        console.log('====================================');
        console.log('DEV SERVER STOPPED');
        console.log('====================================');
        service.stop();
    });

    process.on('SIGINT', function() {
        process.exit(2);
    });
}

startServer();
