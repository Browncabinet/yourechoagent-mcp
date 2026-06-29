# Glama release build for the Echo Agent MCP server.
# Used when files live at the REPO ROOT (yourechoagent-mcp public repo).
FROM node:20-alpine AS build
WORKDIR /app
COPY package.json ./
RUN npm install --include=dev --registry=https://registry.npmjs.org/
COPY tsconfig.json tsup.config.ts ./
COPY src ./src
RUN npm run build && npm prune --omit=dev

FROM node:20-alpine AS runtime
ENV NODE_ENV=production \
    ECHO_API_KEY="" \
    ECHO_API_BASE=""
WORKDIR /app
COPY --from=build /app/package.json ./package.json
COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
LABEL org.opencontainers.image.title="yourechoagent-mcp"
LABEL org.opencontainers.image.description="Echo Agent MCP server — discover events and hire autonomous outreach agents from any MCP client."
LABEL org.opencontainers.image.source="https://github.com/Browncabinet/yourechoagent-mcp"
LABEL com.glama.mcp.required-env="ECHO_API_KEY"
CMD ["node", "dist/index.js"]
