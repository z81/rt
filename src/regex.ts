// class PartRegExp {
//   private maxIndex: number = 0;
//   private totalTakenItems: number = 0;

//   constructor(public part: string, public transformers: Function[] = []) {}

//   map = <T>(fn: (result: string[]) => T) => {
//     if (this.part[0] !== "(") {
//       this.part = `(${this.part})`;
//     }

//     this.transformers.push(fn);

//     return this;
//   };

//   makeCountProxy = (results: string[]) =>
//     new Proxy(results, {
//       get: (target, name) => {
//         if (typeof name !== "symbol") {
//           const index = Number(name);

//           if (Number.isInteger(index)) {
//             this.maxIndex = Math.max(this.maxIndex, index);
//             this.totalTakenItems++;
//           }
//         }

//         return target[name as any];
//       },
//     });

//   transform = (results: string[]) => {
//     const args = [...results];

//     const transResult = Object.assign(
//       {},
//       ...this.transformers.map((fn) => {
//         const proxy = this.makeCountProxy(args);

//         const data = fn(proxy);
//         args.splice(0, this.maxIndex + 1);

//         return data;
//       })
//     );

//     return {
//       result: transResult,
//       totalTakenItems: this.totalTakenItems,
//     };
//   };

//   find = (text: string) => {
//     const result = new RegExp(`^${this.part}`, "gmi").exec(text);
//     if (!result) {
//       return [];
//     }

//     console.log(result);
//     return this.transform(result.splice(1)).result;
//   };
// }

// const part = (strs: TemplateStringsArray, ...parts: PartRegExp[]) => {
//   const transformers: Function[] = [];
//   const regStr = strs.reduce((acc, val, i) => {
//     const part = parts[i];
//     let partStr = "";

//     if (part) {
//       partStr = part.part;
//       transformers.push(...part.transformers);
//     }

//     return `${acc}${val}${partStr}`;
//   }, "");

//   return new PartRegExp(regStr, transformers);
// };

// const number = part`[0-9]*`;
// const episodesRangeMask = part`Серии: (${number})-(${number})( из ${number}|)`.map(
//   ([, start, end, _]) => ({
//     episodes: [start, end],
//   })
// );

// const baseName = part`0-9 \\\\-_\\\\.`;
// const ruName = part`[А-ЯЁ${baseName}]*`.map(([ruName]) => ({ ruName }));
// const enName = part`[A-Z${baseName}]*`.map(([enName]) => ({ enName }));
// const author = part`\\(([\\W ]*)\\)`.map(([, author]) => ({ author }));
// const year = part`([1-2][09][0-9]{2})`.map((year) => ({ year }));
// const seasonMask = part`Сезон: (${number})`.map(([, season]) => ({
//   seasons: [season],
// }));

// const reg = part`${ruName} / ${enName} / ${seasonMask} / ${episodesRangeMask} ${author} \\[${year}`;
// // console.log(episodesRangeMask.transform(["1", "2"]));

// console.log(data[0]);
// return reg.find(data[0]);
