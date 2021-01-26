import got from "got/dist/source";
import cheerio from "cheerio";
import { getInfo } from "./getInfo";

export const BASE_URL = "https://torlook.info/";

export const search = async (query: string) => {
  const { body } = await got(`${BASE_URL}${decodeURI(query)}`);
  const $ = cheerio.load(body);

  const items = $("#resultsDiv .webResult.item");

  const rows = items
    .map((_, e) => {
      const head = $(e).find(">p>a");
      const url = head.attr("href");
      const title = head.text();
      const trackerImage = $(e).find(".h2 img.trackerIcon").attr("src");
      const body = $(e).find(".h2 .webResultTitle");

      return {
        title,
        url,
        tracerIcon: `${BASE_URL}${trackerImage}`,
        trackerName: $(e).find(".h2 a").text(),
        size: body.find(".size").text(),
        date: body.find(".date").text(),
        seeders: +body.find(".torstat .seeders").text().trim(),
        leechers: +body.find(".torstat .leechers").text().trim(),
        magnetToken: body.find(".magneto").data("src"),
        media: getInfo(title),
      };
    })
    .toArray();

  return rows;
};
