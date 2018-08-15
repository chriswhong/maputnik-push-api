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

// use node-cache to store SQL queries
app.styleCache = new NodeCache({ stdTTL: 3600 });

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

module.exports = app.listen(process.env.PORT || 3000);
