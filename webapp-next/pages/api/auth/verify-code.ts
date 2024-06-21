import { Client } from "@elastic/elasticsearch";
import type { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";
import rateLimit from "@/utils/rate-limit";
import { setCookieServerSide } from "@/utils/tools";
const tmpCodes = require("../../../utils/codes");

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 50, // Max 50 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const forwarded = req.headers["x-forwarded-for"];

    const userIp =
      typeof forwarded === "string"
        ? forwarded.split(/, /)[0]
        : req.socket.remoteAddress;

    // Rate limiting to prevent brute force auth
    try {
      await limiter.check(res, 5, userIp as string); // 5 requests max per minute
    } catch (e: any) {
      return res.status(e.statusCode).end(e.message);
    }

    const codeObj = tmpCodes[req.body.username];

    if (codeObj && codeObj.code === req.body.code.toString()) {
      let firstLogin = false;

      const client = new Client({
        node: process.env.ELASTIC_HOST,
        auth: {
          apiKey: codeObj.apiKey.encoded,
        },
        tls: {
          ca: fs.readFileSync(path.resolve(process.cwd(), "./certs/ca/ca.crt")),
          rejectUnauthorized: false,
        },
      });

      try {
        await client.get({
          index: "cm2d_users",
          id: req.body.username,
        });
      } catch (e) {
        firstLogin = true;
      }

      if (!firstLogin) {
        setCookieServerSide(res, codeObj.apiKey.encoded)
      }

      res.status(200).json({
        apiKey:
          firstLogin && process.env.NODE_ENV !== "development"
            ? undefined
            : codeObj.apiKey,
        firstLogin,
      });
    } else {
      res.status(401).end("Unauthorized");
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
