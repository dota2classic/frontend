import {steam32to64} from "@/util/math";



export function steamPage(steam32: string | number){
  return `https://steamcommunity.com/profiles/${steam32to64(steam32)}`
}
