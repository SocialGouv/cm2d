import {
  ELASTIC_API_KEY_NAME,
  clearCookieServerSide
} from "@/utils/tools";
import { Client } from "@elastic/elasticsearch";
import fs from "fs";
import type { NextApiRequest, NextApiResponse } from "next";
import path from "path";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).end("Method Not Allowed");
  }

  const ca = fs.readFileSync(path.resolve(process.cwd(), "./certs/ca/ca.crt"));

  // Effacé inconditionnellement : la déconnexion ne doit pas dépendre du succès
  // de l'invalidation ES, sinon une session déjà expirée reste piégée.
  clearCookieServerSide(res);

  // username déduit de la key : en session expirée le client ne le connaît plus
  // (/api/auth/user a échoué). Body en repli.
  const apiKey = req.cookies[ELASTIC_API_KEY_NAME];
  let username: string | undefined = req.body?.username;

  if (apiKey) {
    try {
      const userClient = new Client({
        node: process.env.ELASTIC_HOST,
        auth: { apiKey },
        tls: { ca, rejectUnauthorized: false }
      });
      const authenticated = await userClient.security.authenticate();
      username = authenticated.username;
    } catch (e) {}
  }

  if (username) {
    try {
      const adminClient = new Client({
        node: process.env.ELASTIC_HOST,
        auth: {
          username: process.env.ELASTIC_USERNAME as string,
          password: process.env.ELASTIC_PASSWORD as string
        },
        tls: { ca, rejectUnauthorized: false }
      });
      await adminClient.security.invalidateApiKey({ username });
    } catch (error) {}
  }

  res.status(200).json({ loggedOut: true });
}
