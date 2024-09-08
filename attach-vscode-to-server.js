// Name: Attach VSCode To Server
// Author: Maksym Polupan
// Shortcut: Cmd+Shift+O

// Note: Feel free to delete this script!

import "@johnlindquist/kit";
import { Client } from 'hetzner-cloud-js';

const apiKey = await env("HCLOUD_KEY");
const client = new Client(apiKey);

const servers = await client.servers.list();
const host = await micro("Select server", 
    servers.servers
    .sort((a, b) => new Date(b.created) - new Date(a.created))
    .map(server => {
        return {
            description: server.publicNet.ipv4.ip,
            name: server.name,
            value: server.publicNet.ipv4.ip
        }
} ));

await exec(`ssh-keygen -R "${host}"`);
await exec(`/opt/homebrew/bin/code --folder-uri vscode-remote://ssh-remote+root@${host}$/root`);

