export const attachVSCode = async (host) => {
    await exec(`ssh-keygen -R "${host}"`);
    await exec(`/opt/homebrew/bin/code --folder-uri vscode-remote://ssh-remote+root@${host}/root`);
}

export const getDb = async () => {
    return await db("vscode-remote-session", { host: null })
}