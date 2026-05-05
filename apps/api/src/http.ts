import crypto from "node:crypto";
import type { NextFunction, Request, Response } from "express";
import pino from "pino";

export const logger = pino({
  level: process.env.LOG_LEVEL ?? "info",
  redact: ["req.headers.authorization", "req.headers.cookie"]
});

export function requestId(req: Request, res: Response, next: NextFunction) {
  const id = req.header("x-request-id") ?? crypto.randomUUID();
  res.setHeader("x-request-id", id);
  req.headers["x-request-id"] = id;
  next();
}

export function securityHeaders(_req: Request, res: Response, next: NextFunction) {
  res.setHeader("x-content-type-options", "nosniff");
  res.setHeader("referrer-policy", "no-referrer");
  res.setHeader("permissions-policy", "camera=(), microphone=(), geolocation=()");
  next();
}
