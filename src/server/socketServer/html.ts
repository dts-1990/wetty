import { isDev } from '../../shared/env.js';
import type { Request, Response, RequestHandler } from 'express';

const jsFiles = isDev ? ['dev.js', 'wetty.js'] : ['wetty.js'];

const render = (
  title: string,
  base: string,
): string => `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, user-scalable=no">
    <link rel="icon" type="image/x-icon" href="${base}/client/favicon.ico">
    <title>${title}</title>
    <link rel="stylesheet" href="${base}/client/wetty.css" />
  </head>
  <body>
    <div id="overlay">
      <div class="error">
        <div id="msg"></div>
        <input type="button" onclick="location.reload();" value="reconnect" />
      </div>
    </div>
    <ul>
        <li>
            <div class="container">
              <a href="#" class="custombutton" id="fsOpenFileButton">Serialize to klogg</a>
            </div> 
        </li>
        <li>
            <div id="options">
               <p>
               <a class="toggler"
                  href="#"
                  alt="Toggle options"
                ><i class="fas fa-cogs"></i></a>
               </p>
               <iframe class="editor" src="${base}/client/xterm_config/index.html"></iframe>
             </div>
        </li>
        <style>
        ul {
          list-style: none;
          padding: 0;
        }

        li {
          display: inline;
          margin-right: 10px; /* optional, adds some spacing between list items */
        }
        </style>
    </ul>
    <div id="terminal"></div>
    ${jsFiles
        .map(file => `    <script type="module" src="${base}/client/${file}"></script>`)
        .join('\n')
    }
  </body>
</html>`;

export const html = (base: string, title: string): RequestHandler => (
  _req: Request,
  res: Response,
): void => {
  res.send(
    render(
      title,
      base,
    ),
  );
};
