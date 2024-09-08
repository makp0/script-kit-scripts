// Name: Attach VSCode To Server SSH
// Description: Launch scriptkit.com/tutorials in your browser
// Author: John Lindquist
// Twitter: @johnlindquist

import "@johnlindquist/kit";
import { Client } from 'hetzner-cloud-js';
import { NodeSSH } from 'node-ssh';

const apiKey = await env("HCLOUD_KEY");
const client = new Client(apiKey);

const servers = await client.servers.list();
const host = await micro("Select server", servers.servers.map(server => {
    return {
        description: server.publicNet.ipv4.ip,
        name: server.name,
        value: server.publicNet.ipv4.ip
    }
} ));

let ssh = new NodeSSH();
await ssh.connect({
    host: host,
    username: 'root',
    agent: process.env.SSH_AUTH_SOCK
});

// Execute command to read all users
let result = await ssh.execCommand('cat /etc/passwd | cut -d: -f1');
// await inspect(result);
if (result.stderr) {
    console.error('Error:', result.stderr);
} else {
    console.log('Users:', result.stdout);
}

// Disconnect from SSH
ssh.dispose();

await exec(`ssh-keygen -R "${host}"`);
await exec(`/opt/homebrew/bin/code --folder-uri vscode-remote://ssh-remote+developer@${host}/home/developer`);

