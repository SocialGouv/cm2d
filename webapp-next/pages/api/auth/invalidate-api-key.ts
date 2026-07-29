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

  // On efface le cookie DANS TOUS LES CAS, avant même de tenter l'invalidation
  // ES. La déconnexion ne doit jamais dépendre du succès d'un appel ES : dans
  // l'état "session expirée" l'ancien code (invalidation → 500 → cookie non
  // effacé → reload → /bo → chargement infini) piégeait l'utilisateur.
  clearCookieServerSide(res);

  // Récupère le username depuis la key du cookie plutôt que depuis le corps de
  // requête : quand la session est expirée, le client ne connaît plus le
  // username (l'appel /api/auth/user a lui aussi échoué). On garde le body en
  // repli pour compat.
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
    } catch (e) {
      // Key déjà expirée/invalide : rien à invalider côté ES, le cookie est
      // effacé, la déconnexion est effective côté client.
    }
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
    } catch (error) {
      // Invalidation best-effort : l'échec ne doit pas bloquer la déconnexion.
    }
  }

  // Toujours 200 : le cookie est effacé, le client peut retourner au login.
  res.status(200).json({ loggedOut: true });
}
