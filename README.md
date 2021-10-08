# Meme Inspector
Simple Web Application to tag and store memes and other files and see a list of all uploads with some details like size, mimetype & upload date.

Operating System: Runs on linux and mac.
Programming language: Meme Inspector is written in pure JavaScript (ES2015) (+HTML & CSS)
Web Framework: We used Svelte 3.0.0 for the frontend, "a radical new approach to building user interfaces. Whereas traditional frameworks like React and Vue do the bulk of their work in the browser, Svelte shifts that work into a compile step that happens when you build your app." (https://svelte.dev/).
The application was tested in Chrome Version 94.0.4606.61, Safari 14.1.2, Brave Version 1.30.87 based on Chromium Version 94.0.4606.71.
For the backend we used Node.js Version 16.10.0, "a JavaScript runtime built on Chrome's V8 JavaScript engine" (https://nodejs.org/en/) and ExpressJS, a "Fast, unopinionated, minimalist web framework for Node.js" (https://expressjs.com/).
For persistence, we use Simple JSONdb, a "simple, no-frills, JSON storage engine for Node.JS with full test coverage" (https://www.npmjs.com/package/simple-json-db), which provides an API to write data into a [JSON file](https://github.com/kolomu/CAD-MemeInspector/blob/master/backend/database.json).
