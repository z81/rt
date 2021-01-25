import { BASE_URL } from "./search";
import got from "got/dist/source";

export const getMagnet = async (token: string) => {
  const { body } = await got(`${BASE_URL}${token}`);
  const magnet = /'(magnet:\?xt=urn:.*)'/gim.exec(body);

  return {
    magnet: magnet && magnet[1],
  };
};
