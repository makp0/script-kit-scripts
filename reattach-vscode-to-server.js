// Name: Attach VSCode To Server
// Author: Maksym Polupan
// Shortcut: Cmd+Shift+R

import "@johnlindquist/kit";
import { getDb, attachVSCode } from './attach-vscode-common.js';

const data = await getDb();
const host = data.host;

if (!host) {
    await div(md(`No previous session found.`))
}

await attachVSCode(host);