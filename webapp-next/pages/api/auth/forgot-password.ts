import { sendMail } from "@/utils/mailter";
import {
  getCodeEmailHtml,
  ELASTIC_API_KEY_NAME,
  getResetPasswordEmailHtml,
} from "@/utils/tools";
import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";
import rateLimit from "@/utils/rate-limit";
import crypto from "crypto";

const limiter = rateLimit({
  interval: 60 * 1000, // 60 seconds
  uniqueTokenPerInterval: 50, // Max 50 users per second
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username } = req.body;

    // const forwarded = req.headers["x-forwarded-for"];

    // const userIp =
    //   typeof forwarded === "string"
    //     ? forwarded.split(/, /)[0]
    //     : req.socket.remoteAddress;

    // // Rate limiting to prevent brute force auth
    // try {
    //   await limiter.check(res, 5, userIp as string); // 5 requests max per minute
    // } catch (e: any) {
    //   return res.status(e.statusCode).end(e.message);
    // }

    const adminClient = new Client({
      node: process.env.ELASTIC_HOST,
      auth: {
        username: process.env.ELASTIC_USERNAME as string,
        password: process.env.ELASTIC_PASSWORD as string,
      },
      tls: {
        ca: fs.readFileSync(path.resolve(process.cwd(), "./certs/ca/ca.crt")),
        rejectUnauthorized: false,
      },
    });

    try {
      const currentUser = await adminClient.security.getUser({ username });

      if (currentUser[username] === undefined) {
        res.status(401).end();
      }

      const resetToken = crypto.randomBytes(32).toString("hex");

      const baseUrl = `${req.headers["x-forwarded-proto"]}://${req.headers.host}`;

      await sendMail(
        "CM2D - Réinitialisation de votre mot de passe",
        username,
        getResetPasswordEmailHtml(
          `${baseUrl}/login/reset-password?token=${resetToken}`
        ),
        `Le lien de réinitialisation de votre mot de passe est : ${baseUrl}/login/reset-password?token=${resetToken}`
      );

      adminClient.create({
        index: "cm2d_reset_tokens",
        id: resetToken,
        body: {
          username,
          token: resetToken,
          expiresAt: new Date(Date.now() + 60 * 60 * 1000),
        },
      });

      res.status(200).send({ response: "ok" });
    } catch (error: any) {
      if (error.statusCode === 401) {
        res.status(401).end();
      } else {
        res.status(500).end();
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
