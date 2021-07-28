import * as React from 'react';
import { gql } from 'urql';
import { useFragment } from './useFragment';
import { Pokemon as PokemonType, PokemonFieldsFragmentDoc} from './__generated__/graphql'

export const POKEMON_FRAGMENT = gql`
  fragment PokemonFields on Pokemon {
    name
    classification
    maxHP
    maxCP
    types
    weight {
      minimum
      maximum
    }
    evolutions { id name evolutions { id name } }
  }
`;

export const Pokemon = (props: { pokemon: PokemonType }) => {
  const data = useFragment(PokemonFieldsFragmentDoc, props.pokemon);
  console.log(data);
  return (
    <li style={{ display: 'flex', flexDirection: 'column', marginBottom: 4 }}>
      <h1>{data.name} - {data.classification}</h1>
      <span>MAX HP: {data.maxHP}</span>
      <span>MAX CP: {data.maxCP}</span>
      <span>Weight: {data.weight?.minimum} - {data.weight?.maximum}</span>
      {data.evolutions &&
        <ul>
          {data.evolutions.map(x => x && <li key={x.id}>{x.name}</li>)}
        </ul>
      }
    </li>
  )
}
