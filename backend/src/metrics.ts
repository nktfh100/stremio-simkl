import { RequestHandler } from "express";
import client from "prom-client";

let register: client.Registry;

export const getRegister = () => register;

const httpRequestDurationMicroseconds = new client.Histogram({
  name: "http_request_duration_ms",
  help: "Duration of HTTP requests in ms",
  labelNames: ["method", "route", "code"],
  buckets: [0.1, 5, 15, 50, 100, 300, 500, 1000, 3000, 5000, 10000],
});

const httpRequestCounter = new client.Counter({
  name: "http_requests_total",
  help: "Total number of HTTP requests",
  labelNames: ["method", "route", "code"],
});

export const initMetrics = () => {
  register = new client.Registry();

  register.registerMetric(httpRequestDurationMicroseconds);
  register.registerMetric(httpRequestCounter);
};

export const metricsEndpoint: RequestHandler = async (_req, res) => {
  res.setHeader("Content-Type", getRegister().contentType);
  res.send(await getRegister().metrics());
};

export const metricsMiddleware: RequestHandler = (req, res, next) => {
  const end = httpRequestDurationMicroseconds.startTimer();
  res.on("finish", () => {
    end({
      route: req.route.path,
      code: res.statusCode,
      method: req.method,
    });

    httpRequestCounter.inc({
      method: req.method,
      route: req.route.path,
      code: res.statusCode,
    });
  });
  next();
};
