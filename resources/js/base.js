async function getConfig() {
    const request = await fetch(`config.json`);
    const config = await request.json();

    return config;
}

async function getServerAddress() {
    const config = await getConfig();

    let server;

    if (window.location.hostname === 'localhost') {
        server = config.server.local;
    } else {
        server = config.server.production;
    }

    return server;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}