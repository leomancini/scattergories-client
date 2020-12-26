async function getSecrets() {
    const request = await fetch(`secrets.json`);
    const secrets = await request.json();

    return secrets;
}

async function getServerAddress() {
    const secrets = await getSecrets();

    let server;

    if (window.location.hostname === 'localhost') {
        server = secrets.server.local;
    } else {
        server = secrets.server.production;
    }

    return server;
}

function capitalize(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}