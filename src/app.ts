import fastify from "fastify";
import { search } from "./search";
import { getMagnet } from "./getMagnet";

import torrentStream from "torrent-stream";
const MemoryChunkStore = require("memory-chunk-store");

const getTorrentStream = (magnet: string) =>
  new Promise<TorrentStream.TorrentEngine>((resolve) => {
    const engine = torrentStream(magnet, {
      // @ts-ignore
      storage: (...args) => new MemoryChunkStore(...args),
    });

    engine.on("ready", () => resolve(engine));
  });

const run = async () => {
  try {
    const server = fastify();

    server.register(require("fastify-cors"), {});

    server.get("/info", async (req, res) => {
      if (!req.query.magnet) {
        return res.code(400);
      }

      const engine = await getTorrentStream(req.query.magnet);

      res.send({
        files: engine.files.map(({ name }) => ({ name })),
      });
    });

    server.get("/watch", async (req, res) => {
      if (!req.query.magnet || !req.query.name) {
        return res.code(400);
      }

      const engine = await getTorrentStream(req.query.magnet);

      engine.files.forEach((file) => {
        if (file.name === req.query.name) {
          res.send(
            file.createReadStream().on("data", (buff: Buffer) => {
              const { chunks } = (engine as any).store.store;
              chunks.forEach((_: any, i: number) => (chunks[i] = undefined));
            })
          );
        }
      });
    });

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
