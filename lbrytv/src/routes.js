const { getHtml } = require('./html');
const { generateStreamUrl, CONTINENT_COOKIE } = require('../../ui/util/lbrytv');
const Router = require('@koa/router');

const router = new Router();

function getStreamUrl(ctx) {
  const { claimName, claimId } = ctx.params;

  // hack to get around how we managing the continent cookie
  // defaulting to "NA" becasue saved-passwords.js assumes it's in the browser and won't work properly
  // changes need to be made to that to better work with the server
  const streamingContinentCookie = ctx.cookies.get(CONTINENT_COOKIE) || 'NA';
  const streamUrl = generateStreamUrl(claimName, claimId, undefined, streamingContinentCookie);
  return streamUrl;
}

router.get(`/$/download/:claimName/:claimId`, async ctx => {
  const streamUrl = getStreamUrl(ctx);
  const downloadUrl = `${streamUrl}?download=1`;
  ctx.redirect(downloadUrl);
});

router.get(`/$/stream/:claimName/:claimId`, async ctx => {
  const streamUrl = getStreamUrl(ctx);
  ctx.redirect(streamUrl);
});

router.get('*', async ctx => {
  const html = await getHtml(ctx);
  ctx.body = html;
});

module.exports = router;
