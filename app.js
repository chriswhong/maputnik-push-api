const Koa = require('koa');
const cors = require('@koa/cors');
const bodyParser = require('koa-bodyparser');
const NodeCache = require('node-cache');

const styleRoute = require('./routes/style');

const app = new Koa();
app.use(bodyParser());
app.use(cors({
  origin: '*',
}));

// use node-cache to store SQL queries, time to live = 30 minutes
app.styleCache = new NodeCache({ stdTTL: 1800 });

// better error handling
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    ctx.status = err.status || 500;
    ctx.body = { errors: [err] };
    ctx.app.emit('error', err, ctx);
  }
});

app.use(styleRoute.routes());

console.log(`Maputnik Push API listening on port ${process.env.PORT || 3000}`); // eslint-disable-line
module.exports = app.listen(process.env.PORT || 3000);
