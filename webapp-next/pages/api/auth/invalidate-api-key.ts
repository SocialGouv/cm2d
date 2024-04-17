import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { username } = req.body;

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
      const invalidatedApiKey = await adminClient.security.invalidateApiKey({
        username,
      });

      res.status(200).json(invalidatedApiKey);
    } catch (error: any) {
      res.status(500).end();
    }
  } else {
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
