// const { logEvents } = require("./logger");
/* const errorHandler = (err, req, res, next) => {
  logEvents(
    `${err.name}: ${err.message}\t${req.method}\t${req.url}\t${req.headers.origin}`,
    "errLog.log",
  );
  console.log(err.stack);
  const status = res.statusCode ? res.statusCode : 500;
  res.status(status).json({ message: err.message });
}; */
const winston = require("winston");
const expressWinston = require("express-winston");

const errorFormat = winston.format.printf((info) => {
  return info;
});

const errorConfig = Object.create({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    errorFormat,
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({
      filename: "logs/errLog.log",
      // level: "error",
    }),
  ],
  meta: false,
  msg: "HTTP {{req.method}} / {{req.url}} / {{req.header.origin}}",
  expressFormat: false,
  colorize: true,
});

// module.exports = expressWinston.errorLogger(errorConfig);
module.exports = expressWinston.errorLogger({
  transports: [new winston.transports.Console()],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json(),
  ),
});
