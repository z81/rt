import { range } from "ramda";

const getSeasons = (title: string) => {
  const seasonRes = /(сезон[ ]*[:]?[ ]*(\d+)|(\d+)[ ]*сезон|(S\d+))/gim.exec(
    title
  );
  const season =
    seasonRes && (+seasonRes[2] || +seasonRes[3] || +seasonRes[0].substr(1));

  const seasonRangeRes = /([(/|.,\[]+[ ]*сезоны?[ ]*[:]?[ ]*(\d+)-(\d+)|(\d+)-(\d+)[ ]*сезоны?|S(\d+)-S?(\d+))/gim.exec(
    title
  );

  const seasonStart =
    seasonRangeRes &&
    Number(seasonRangeRes[2] || seasonRangeRes[4] || seasonRangeRes[6]);
  const seasonEnd =
    seasonRangeRes &&
    Number(seasonRangeRes[3] || seasonRangeRes[5] || seasonRangeRes[7]);

  const seasons = seasonStart
    ? range(seasonStart, (seasonEnd ?? 0) + 1)
    : [season];

  return seasons;
};

const getEpisodes = (title: string) => {
  const episodeRes = /(серия[ ]*[:]?[ ]*(\d+)|(\d+)[ ]*серия|(E\d+))/gim.exec(
    title
  );
  const episode =
    episodeRes &&
    (+episodeRes[2] || +episodeRes[3] || +episodeRes[0].substr(1));

  const episodeResRangeRes = /([(/|.,\[]+[ ]*сери[ий][ ]*[:]?[ ]*(\d+)-(\d+)|(\d+)-(\d+)[ ]*сери[ий]|E(\d+)-E?(\d+))|(\d+) из (\d+)|(\d+)-(\d+) из |\[(\d+)-(\d+)\]/gim.exec(
    title
  );

  const episodeResStart =
    episodeResRangeRes &&
    Number(
      episodeResRangeRes[2] ||
        episodeResRangeRes[4] ||
        episodeResRangeRes[6] ||
        episodeResRangeRes[8] ||
        episodeResRangeRes[10] ||
        episodeResRangeRes[12]
    );
  const episodeResEnd =
    episodeResRangeRes &&
    Number(
      episodeResRangeRes[3] ||
        episodeResRangeRes[5] ||
        episodeResRangeRes[7] ||
        episodeResRangeRes[9] ||
        episodeResRangeRes[11] ||
        episodeResRangeRes[13]
    );

  const episodes = episodeResEnd
    ? range(episodeResStart ?? 1, episodeResEnd + 1)
    : [episode];

  return episodes.filter(Boolean);
};

const getQuality = (title: string) => {
  const res = /((?:PPV\.)?[HP]DTV|(?:HD)?CAM|B[DR]Rip|(?:HD-?)?TS|(?:PPV )?WEB-?DL(Rip)?(?: DVDRip)?|HDRip|DVDRip|DVDRIP|CamRip|W[EB]BRip|BluRay|Blu-Ray Remux|BDRemux|DvDScr|hdtv|telesync)/gim.exec(
    title
  );

  return res && res[0];
};

const getResolution = (title: string) => {
  const result = /([0-9]{3,4}p)/gim.exec(title);

  return result && result[0];
};

const getContainer = (title: string) => {
  const result = /(MKV|AVI|MP4)/gim.exec(title);

  return result && result[0];
};

const getAudio = (title: string) => {
  const result = /(MP3|DD5\.?1|Dual[\- ]Audio|LiNE|DTS|AAC[.-]LC|AAC(?:\.?2\.0)?|AC3(?:\.5\.1)?)/gim.exec(
    title
  );
  //([\])|]([\w\sа-яё]*)$|(ПМ|ПЛ|ЛМ|ПД|ЛД)[ ]*\(.*?\))
  return result && result[0];
};

const getVoice = (title: string) => {
  const result = /\]\s*[0-9x ]*\s*(MVO|DVO)[\s]*(\(?(.+)\))?[\s]+(.+)$|([\])|]([\w\sа-яё,]+)(Sub ([\w,\s]+))?$|(ПМ|ПЛ|ЛМ|ПД|ЛД)[ ]*\((.*?)\))|(\((\w+)\)$)|\(?(\w+)\)?[\s]*\[AD\]$|\(([а-яёa-z ,+]+)\)\s*$/gim.exec(
    title
  );

  const voicesStr =
    result &&
    (result[13] ||
      result[12] ||
      result[11] ||
      result[10] ||
      result[9] ||
      result[7] ||
      result[6] ||
      result[5] ||
      result[3] ||
      result[2]);

  return voicesStr?.split(/[,+|]/).map((voice) => voice.trim());
};

const getCodec = (title: string) => {
  const result = /(xvid|[hx]\.?26[45])/gim.exec(title);

  return result && result[0];
};

export const getInfo = (title: string) => {
  const episodes = getEpisodes(title);
  const seasons = getSeasons(title);
  const quality = getQuality(title);
  const resolution = getResolution(title);
  const voice = getVoice(title);
  const code = getCodec(title);
  const audio = getAudio(title);
  const container = getContainer(title);

  return {
    episodes,
    seasons,
    quality,
    resolution,
    voice,
    code,
    container,
    audio,
  };
};
