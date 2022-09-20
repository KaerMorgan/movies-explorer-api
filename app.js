require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { errors } = require('celebrate');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const routes = require('./routes');
const errorHandler = require('./middlewares/errorHandler');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const { PORT = 3000 } = process.env;
const { DATABASE_ADDRESS, NODE_ENV } = process.env;

const app = express();

app.use(requestLogger);
app.use(cors()); // Управление кросс-доменными запросами
app.use(limiter); // Защита от DoS-атак
app.use(helmet()); // Устранение уязвимостей в http заголовках

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(routes);

app.use(errorLogger);
app.use(errors()); // обработчик ошибок celebrate
app.use(errorHandler);

async function main() {
  try {
    await mongoose.connect(
      NODE_ENV === 'production'
        ? DATABASE_ADDRESS
        : 'mongodb://localhost:27017/bitfilmsdb',
      {
        useNewUrlParser: true,
      },
    );
    await app.listen(PORT);

    console.log(`Connected to MongoDB. App listening on port ${PORT}`);
  } catch (error) {
    console.log(error.name, error.message);
  }
}

main();
