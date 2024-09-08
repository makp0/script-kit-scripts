// Name: Attach VSCode To Server
// Author: Maksym Polupan
// Shortcut: Cmd+Shift+O

import "@johnlindquist/kit";
import { Client } from 'hetzner-cloud-js';
import { getDb, attachVSCode } from './attach-vscode-common.js';

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

const data = await getDb();
data.host = host;
await data.write();

await attachVSCode(host);
