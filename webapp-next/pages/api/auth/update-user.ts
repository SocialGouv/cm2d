import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username, password } = req.body as {
      username: string;
      password: string;
    };

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
      await adminClient.security.changePassword({
        username: username,
        body: {
          password,
        },
      });

      res.status(200).send({ response: "ok" });
    } catch (error: any) {
      if (error.statusCode) {
        res.status(error.statusCode).end();
      } else {
        res.status(500).end();
      }
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
