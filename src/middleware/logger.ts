import type { NextFunction, Request, Response } from "express";
import pc from "picocolors";

export const logger = (req: Request, res: Response, next: NextFunction): void => {
  const start = process.hrtime();

  res.on("finish", () => {
    const diff = process.hrtime(start);
    const duration = (diff[0] * 1e3 + diff[1] * 1e-6).toFixed(2);
    
    // Bangladesh Local Time
    const timestamp = new Intl.DateTimeFormat("en-GB", {
      dateStyle: "short",
      timeStyle: "medium",
      timeZone: "Asia/Dhaka",
    }).format(new Date());

    // Status code tracking markers
    let statusColor = pc.green;
    if (res.statusCode >= 400 && res.statusCode < 500) statusColor = pc.yellow;
    if (res.statusCode >= 500) statusColor = pc.red;

    console.log(
      `${pc.gray(`[${timestamp}]`)} ${pc.bold(pc.cyan(req.method.padEnd(6)))} ${statusColor(res.statusCode)} ${pc.white(req.originalUrl)} - ${pc.magenta(`${duration}ms`)}`
    );
  });

  next();
};