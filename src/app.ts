import fastify from "fastify";
import { search } from "./search";
import { getMagnet } from "./getMagnet";

const run = async () => {
  try {
    const server = fastify();

    server.get("/search/:query", async ({ params }) => {
      return await search(params.query);
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
