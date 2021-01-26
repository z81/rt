import fastify from "fastify";
import { search } from "./search";
import { getMagnet } from "./getMagnet";
import { getEpisodes } from "./getInfo";

const run = async () => {
  try {
    const server = fastify();

    server.get("/search/*", async (req) => {
      return await search(req.req.url?.substr(8) ?? "");
    });

    server.get("/magnet/*", async (req) => {
      return await getMagnet(req.req.url?.substr(7) ?? "");
    });

    server.listen(5280, "0.0.0.0");
    console.log("Listen 0.0.0.0:5280");
  } catch (e) {
    console.error(e);
  }
};

run();
