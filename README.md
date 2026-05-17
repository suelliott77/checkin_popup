# Daily Check-In

A lightweight Electron app that sits in a corner of your screen and reminds you to text the people you care about.

Every day it surfaces a rotating list of contacts from your personal list — prioritizing whoever you haven't reached out to in the longest time. Check them off as you text them, and the app tracks when you last connected with each person.

## Features

- **Daily rotation** — picks N people from your list each day, weighted toward those you haven't texted recently
- **Per-contact notes** — store prayer requests and general notes for each person
- **Progress tracking** — shows how many people you've checked off today
- **Always-on-top popup** — stays visible in a corner of your screen without taking up taskbar space
- **Minimize to header** — collapses to a slim 56px bar when you want it out of the way
- **Customizable** — configure how many people per day (1–8), which screen corner, and window opacity
- **Persistent data** — contacts and daily state are saved locally between sessions
- **Auto-launch on startup** — registers itself as a login item so it's always there

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later recommended)

### Install & Run

```bash
npm install
npm start
```

### Build a distributable

```bash
# Unpacked (faster, for local use)
npm run build

# Full installer (NSIS on Windows, DMG on macOS)
npm run dist
```

Output goes to the `dist/` directory.

### Launch without a terminal (Windows)

Double-click `launch.vbs` to start the app silently — no console window appears.

## Usage

1. **Add people** — open the app and click "Add People" (or "Manage People →" from the daily view). Enter a name, any prayer requests, and notes.
2. **Daily view** — each morning the app picks your configured number of people. Expand a card to see their prayer requests and notes.
3. **Check off** — click the checkbox when you've texted someone. The app records today's date as their last-contacted date.
4. **Settings** — click the gear icon to change how many people appear per day, which screen corner the window lives in, and window opacity.

## Data Storage

All data is stored in a single JSON file at Electron's `userData` path:

- **Windows:** `%APPDATA%\daily-checkin\checkin-data.json`
- **macOS:** `~/Library/Application Support/daily-checkin/checkin-data.json`

No data is sent anywhere — everything stays on your machine.

## Project Structure

```
├── main.js        # Electron main process — window management, IPC, data persistence
├── preload.js     # Context bridge — exposes safe IPC API to the renderer
├── index.html     # Entire UI (styles + JavaScript) in a single file
├── launch.vbs     # Silent launcher script for Windows
└── package.json
```
