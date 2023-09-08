import * as React from 'react';
import { gql } from 'urql';
import { useFragment } from './useFragment';
import { Pokemon as PokemonType } from '../__generated__/baseGraphQLSP';

export const POKEMON_FRAGMENT = gql`
  fragment PokemonFields on Pokemon {
    name
    maxHP
    maxCP
    types
    classification
    evolutions { id name evolutions { id name } }
  }
` as typeof import('./Pokemon.generated').PokemonFieldsFragmentDoc

export const Pokemon = (props: { pokemon: PokemonType }) => {
  const data = useFragment(POKEMON_FRAGMENT, props.pokemon);
  return (
    <li style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
      <h1>{data.name} - {data.classification}</h1>
      <span>MAX HP: {data.maxHP}</span>
      <span>MAX CP: {data.maxCP}</span>
      {data.evolutions &&
        <ul>
          {data.evolutions.map(x => x && <li key={x.id}>{x.name}</li>)}
        </ul>
      }
    </li>
  )
}
