
import React from 'react'

import { } from '..'

import c from './HeroIcon.module.scss'

interface IHeroIconProps {
  hero: string;
}

export const HeroIcon: React.FC<IHeroIconProps> = ({ hero }) => {
  const heroName = hero.replace("npc_dota_hero_", "");
  return (
    <img className={c.hero} alt={`Icon of hero ${heroName}`} src={`/heroes/${heroName}.webp`} />
  )
}

