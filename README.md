graphs
======
google spreadsheet api
node express framework
graphs


Requires Node.js 26.12.1 or a newer Node 26 release (see `.nvmrc`).
Install dependencies with `npm ci`, and set `API_KEY` in your environment or a
local `.env` file to a Google API key with access to the Sheets API.

start with:

    npm start

The server uses `PORT`, then `VCAP_APP_PORT`, or port 3000 by default.


### development info
Run the development server with Node's built-in watch mode (restarts on JS changes):

    npm run dev

Run tests with `npm test`, or `npm run test:watch` for continuous testing.
Changes to Pug templates and static assets are picked up on browser refresh.

First 2 weeks arn't shown in stats!

`worksheet id` is worksheet order in UI

### deploy via ansible
Pushes to `master` are automatically deployed with GitHub Actions (.github folder).
    ./run.sh --tags graphs

The separate `kraag22/ansible` repository manages the production runtime. Ensure
it provisions Node 26.12.1 or newer within the Node 26 line before deploying.
