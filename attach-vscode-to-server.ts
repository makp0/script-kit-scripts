// Name: Attach VSCode To Server
// Description: Launch scriptkit.com/tutorials in your browser
// Author: John Lindquist
// Twitter: @johnlindquist
// Shortcut: Cmd+Shift+O

// Note: Feel free to delete this script!

import "@johnlindquist/kit";
import { Client } from 'hetzner-cloud-js';

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

const data = await db("vscode_sessions", { sessions: { users: []}});
await data.read();

let session = await data.sessions[host];

let user;
if (session?.users.any()) {

    user = await arg("Enter user");
    data.sessions[host] = { users: [ user ] };
}
else{
    user = await arg("Select a user", session.users);
    const index = session.users.indexOf(user);
    session.users.splice(index, 1);
    session.users.unshift(user);
}

await data.write();

const remoteDir = user === "root" ? "/root" : "/home/" + user;

await exec(`ssh-keygen -R "${host}"`);
await exec(`/opt/homebrew/bin/code --folder-uri vscode-remote://ssh-remote+${user}@${host}${remoteDir}`);

