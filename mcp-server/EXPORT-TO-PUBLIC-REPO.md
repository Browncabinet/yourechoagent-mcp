# Exporting this folder to the public `yourechoagent-mcp` repo

This folder is the source for the public MCP package
`@browncabinet/yourechoagent-mcp`. To keep the main app repo private while the
MCP server stays public on GitHub, copy this folder's contents (NOT the folder
itself) to a new public GitHub repo.

## One-time setup

```bash
# 1. Create the empty public repo on GitHub (UI):
#    Owner: Browncabinet
#    Name:  yourechoagent-mcp
#    Visibility: Public
#    Do NOT initialize with README/license/gitignore.

# 2. On your machine, clone an empty target dir and copy these files in:
mkdir ~/yourechoagent-mcp && cd ~/yourechoagent-mcp

# Copy everything from this mcp-server folder EXCEPT this export guide:
cp -R /path/to/Your-Echo-Agent/mcp-server/* .
rm -f EXPORT-TO-PUBLIC-REPO.md

# 3. Initialize git and push
git init
git add .
git commit -m "Initial public MCP server"
git branch -M main
git remote add origin https://github.com/Browncabinet/yourechoagent-mcp.git
git push -u origin main
```

## Ongoing sync

When tool definitions change in this private repo (`mcp-server/src/`), run:

```bash
cd ~/yourechoagent-mcp
cp -R /path/to/Your-Echo-Agent/mcp-server/src/* src/
cp /path/to/Your-Echo-Agent/mcp-server/package.json .
cp /path/to/Your-Echo-Agent/mcp-server/CHANGELOG.md .
git add -A && git commit -m "Sync from main repo vX.Y.Z" && git push
```

## Publishing to npm

Tag a release in the **public** repo:

```bash
cd ~/yourechoagent-mcp
git tag v0.2.0
git push origin v0.2.0
```

The bundled `.github/workflows/publish.yml` (add one if missing) publishes to
npm using the `NPM_TOKEN` secret you set in the public repo's
Settings → Secrets and variables → Actions.

## After the first push, update the Glama listing

Glama caches the old repo URL. Edit the listing:

1. Go to https://glama.ai/mcp/servers/Browncabinet/yourechoagent-mcp
2. If it 404s, re-submit at https://glama.ai/mcp/servers/new with the new repo URL.
3. The `glama.json` in this folder is already configured for the new repo.

## What stays private

- `supabase/functions/mcp-http/` (the hosted HTTP server Smithery uses)
- The React app, business logic, prompts, customer data
- All Supabase keys and secrets

The public MCP package is a thin stdio client that proxies most tools to the
hosted endpoint, so your business logic never ships to GitHub.
