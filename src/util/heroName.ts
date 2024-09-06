import heroes from "./texts/heroes";

export default (fullName?: string) => {
  return heroes.find(it => it.tag === fullName)?.name || "";
};
