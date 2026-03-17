// const { format } = require("date-fns");
// const { v4: uuid } = require("uuid");
const winston = require("winston");
const expressWinston = require("express-winston");

// const fs = require("fs");
// const fsPromises = require("fs").promises;
// const path = require("path");

/* const logEvents = async (message, logFileName) => {
  const dateTime = format(new Date(), "yyyyMMdd\tHH:mm:ss");
  const logItem = `${dateTime}\t${uuid()}\t${message}\n`;
  try {
    if (!fs.existsSync(path.join(__dirname, "..", "logs"))) {
      await fsPromises.mkdir(path.join(__dirname, "..", "logs"));
    }
    await fsPromises.appendFile(
      path.join(__dirname, "..", "logs", logFileName),
      logItem,
    );
  } catch (error) {
    console.log(error);
  }
};

const logger = (req, res, next) => {
  logEvents(`${req.method}\t${req.url}\t${req.headers.origin}`, "reqLog.log");
  console.log(`${req.method} ${req.url}`);
  next();
}; */

const myConsoleFormat = winston.format.printf(({ meta }) => {
  return `${meta.req.method} ${meta.req.url}`;
});

const loggerFormat = winston.format.printf(({ meta }) => {
  return `${meta.req.method}\t${meta.req.url}\t${meta.req.headers.originalUrl}`;
});

const defaultConfig = Object.create({
  format: winston.format.combine(
    winston.format.timestamp({
      format: "YYYY-MM-DD HH:mm:ss",
    }),
    loggerFormat,
  ),
  transports: [
    new winston.transports.Console({
      format: myConsoleFormat,
    }),
    new winston.transports.File({ filename: "logs/reqLog.log" }),
  ],
  meta: true, 
  msg: "HTTP {{req.method}} {{req.url}} - Origin: {{req.headers.origin}}", 
  expressFormat: false, 
  colorize: true,
});

const logger = expressWinston.logger(defaultConfig);

module.exports = { logger };
