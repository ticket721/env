
import * as Express from 'express';
import * as Next    from 'next';
import { routes }   from '@utils/routing';

// tslint:disable-next-line
const I18NMDW = require('next-i18next/middleware');
import { I18N }     from '@utils/misc/i18n';

const port = process.env.PORT || 3000;

const app = Next({ dev: process.env.NODE_ENV !== 'production' });

const handle = routes.getRequestHandler(app);

(async (): Promise<void> => {
    await app.prepare();
    const server = Express();

    await server
        .use(I18NMDW(I18N))
        .use(handle)
        .listen(port);

    console.log(`> Ready on http://localhost:${port}`);

})();
