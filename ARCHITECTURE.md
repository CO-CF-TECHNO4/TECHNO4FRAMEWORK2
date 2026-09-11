# ARCHITECTURE.md - TECHNO4FRAMEWORK2 Architecture Map

This document serves as the high-level architecture reference for AI agents (Grok, OpenClaw, Antigravity) and developers.

## 1. Project Overview
- **Name**: TECHNO4FRAMEWORK2 (v2.0)
- **Goal**: Fullstack reactive ecosystem for mobile, desktop, and real-time control systems.
- **Root Location**: `D:/_DEVE/framework_techno4/TECHNO4FRAMEWORK2/`

## 2. Core Pillars
1. **Frontend UI Core (`packages/techno4-framework2-core`)**:
   - Modernized from Framework7 v9 Core (clean vanilla JS, Web Components, Store, Router).
   - Unified single **Techno4 Theme** (no iOS vs MD fragmentation).
   - Precompiled icon fonts (Fontello workflow, zero-build compilation).
   - Zero dependencies on React, Vue, or Svelte.
2. **Headless Backend (`packages/techno4-framework2-total`)**:
   - Total.js v5 without jComponent or Tangular server UI rendering.
   - Provides Total Actions, Schemas, and high-performance WebSocket/SSE transport.
3. **Dataflow Engine (`packages/techno4-framework2-threads`)**:
   - Rebranded and customized Total.js Threads v11 (ThreadsStream).
   - Visual node-based event pipelines and IoT signal processing.
   - Transitioning UI rendering from legacy jComponent to Techno4 Core.
4. **DOM Manipulation (`packages/techno4-framework2-dom64`)**:
   - Modernized Dom7 fork optimized for fast DOM operations.
5. **Developer Tooling (`packages/techno4-framework2-cli`, `packages/techno4-framework2-rollup`)**:
   - `techno4-cli`: CLI generator with Web UI rewritten completely in Techno4 Core.
   - Modern Rollup/Vite plugins for `.techno4` single-file components.

## 3. Applications
- **Boonker (`apps/techno4-framework2-boonker`)**:
   - Main showcase and development application built with Vite.
   - Hosts **Threads Studio** as an integrated View tab (`apps/techno4-framework2-boonker/pages/threads.html`).

## 4. Key Namespaces & Identifiers
- Global Object: `Techno4` (formerly `Framework7`)
- App Instance: `t4` (formerly `f7` / `app`)
- DOM Helper: `Dom64` / `$$` (formerly `Dom7` / `$$`)
- Prefix: `t4-` for classes, events, and custom elements.
