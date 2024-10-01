# Request-Response Cycle Profiler 📫
<a href='http://www.recurse.com' title='Made with love at the Recurse Center'><img src='https://cloud.githubusercontent.com/assets/2883345/11325206/336ea5f4-9150-11e5-9e90-d86ad31993d8.png' height='20px'/></a>
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-339933?logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-000000?logo=express&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?logo=postgresql&logoColor=white)

The request-response cycle profiler is an educative profiler which tracks performance times across the request-response lifecycle, allowing you to toggle payload sizes, algorithmic complexity, and SQL queries. 

<hr>

## Table of Contents
- [Introduction](#request-response-cycle-profiler-)
- [Core Technologies](#core-technologies)
- [Installation](#installation)
- [How to Use](#how-to-use)
- [Codebase Overview](#codebase-overview)
- [Technical Features](#technical-features)
- [Future Improvements](#future-improvements)
- [License](#license)

## Core Technologies

- **Frontend**
  - TypeScript - _add static typing to JavaScript_
  - HTML / CSS - _create static navigation body content and stylize as split-screen SPA_
- **Backend**
  - Node.js - _utilize dns, net, and tls core modules_
  - Express.js - _manages logic for custom middleware and measurement endpoint_
- **Database**
  - Supabase - _host PostgreSQL database on Supabase's free plan_
  - PostgreSQL - _RDBMS which supports SQL for querying data_
  - SQL - _query from [example.csv](https://github.com/user-attachments/files/17195551/example.csv)_
- **Deployment**
  - Render - _deploy client (i.e. HTML, CSS, JavaScript) on Render's free plan_  
  - Railway - _deploy backend on Railway to avoid Render's free plan server downtimes_ 

## Installation

As a reminder, this profiler is available to demo on [render](https://req-res-cycle-profiler.onrender.com/).

Before installing, you will need to create an account with Supabase and deploy your own DB [here](https://supabase.com/dashboard/projects). Copy the connection details provided in the dashboard section of Supabase to your clipboard, as these will be used to establish your own DB for the project.

Below are the steps to install and build upon this profiler:

**1. Clone the respository to your IDE:**
```
git clone https://github.com/jordaz14/req-res-cycle-profiler.git
```
**2. Navigate to the project directory:**
```
cd req-res-cycle-profiler.git
```
**3. Install npm in both the `./client` and `./server` directories to get dependencies:**
```
cd ./client && npm install && cd ../server && npm install
```
**4. Create a `.env` file in the `./server` directory in the following format to configure your database:**
```
SUPABASE_URL="<supabase_url>"
SUPABASE_ANON_KEY="<supabase_anon_key>"
```
**5. Download the following [example.csv](https://github.com/user-attachments/files/17195551/example.csv) and upload it as a table entitled 'example' to your Supabase project.**

**6. Use LiveServer to run your `./client` and the following command to run your `./server`:**
```
npm run dev
```
**7. Ready to Use!**

## How to Use

**Navigate Info Section**

https://github.com/user-attachments/assets/e7e22016-0ee3-4251-98db-a3b4e0d017aa

**Measure Request-Response Cycle Time**

https://github.com/user-attachments/assets/55b97164-71c4-430c-9d23-5b8f3392d1a8

**Toggle Filters (e.g Algorithmic Complexity)**

https://github.com/user-attachments/assets/2e7bc17f-eda7-4d9a-b85b-2150fe925f62

## Codebase Overview

- **CLIENT**
  - **src**
    - [content.ts](./client/src/content.ts) - dynamically change body content for different segments of request-response cycle
    - [filter.ts](./client/src/filter.ts) - manages state of filters, handles form radio inputs
    - [index.ts](./client/src/index.ts) - measures request times (e.g. construction, sending, parsing), response parsing time, and scripting time
    - [table.ts](./client/src/table.ts) - updates table measurements
- **SERVER**
  - **src**
    - [app.ts](./server/src/app.ts) - measures network times (e.g. DNS, TCP, and TLS), response times, and database execution time
  - **types**
    - [express.d.ts](./server/types/express.d.ts) - modifies type of express request to include props appended via middleware

## Technical Features

- **Performance / Network Monitoring**
- **Open Source Contribution to DefinitelyTyped**
- **Single Page Application without Frontend Framework**
- **Custom Logging Middleware and Request Modifications**
- **Dynamic Algorithmic Time Complexity Toggling**

## Future Improvements
- [ ] Add total time (ms) element for table times
- [ ] Segment out database execution time between connection & query times
- [ ] Limit max payload sizes due to server error when deployed
- [ ] Incorporate code blocks for each filter option to show logic that's modified
- [ ] Refactor table.ts logic & add comments
- [ ] Resolve DNS, TCP, and TLS connection times to not target separate Netlify hostname

## License
This project is licensed under the GNU General Public License (GPL) - see the [LICENSE](./LICENSE) file for details.
