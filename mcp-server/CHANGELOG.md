# Changelog

All notable changes to this project are documented here. Format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [0.2.0] - 2026-06-28

### Added
- 4 new tools for parity with the hosted MCP endpoint:
  - `discover_events` — find conferences, webinars, meetups, podcasts in a niche (demo tier, no API key required).
  - `draft_outreach_for_event` — AI-generated event-specific cold email (subject + body).
  - `generate_comment_for_community` — 2 value-first comment variants for LinkedIn/Reddit/Slack threads.
  - `add_to_radar` — save a discovered event to your Echo Agent Radar (requires `ECHO_API_KEY`).
- Stdio tools now transparently proxy demo-tier capabilities to the hosted Streamable HTTP endpoint so local users don't need their own Firecrawl / AI keys.

## [0.1.0] - 2026-06-19

### Added
- Initial release.
- Six tools: `list_available_agents`, `get_agent_card`, `hire_echo_agent`, `get_job_status`, `control_job`, `rate_job`.
- Stdio transport, compatible with Claude Desktop, Cursor, Windsurf, Continue, and any MCP-compatible client.
- `ECHO_API_KEY` + optional `ECHO_API_BASE` configuration.
- Glama-ready `glama.json` manifest.
