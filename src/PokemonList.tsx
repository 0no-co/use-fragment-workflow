import React from 'react';
import { gql, useQuery } from 'urql';
import { Pokemon, POKEMON_FRAGMENT } from './Pokemon';
import { PokemonsDocument } from './__generated__/graphql';

export const POKEMONS_QUERY = gql`
  query Pokemons {
    pokemons(limit: 10) {
      id
      __typename
      ...PokemonFields
    }
  }

  ${POKEMON_FRAGMENT}
`;

const PokemonList = () => {
  const [result] = useQuery({ query: PokemonsDocument });

  const { data, fetching, error } = result;

  return (
    <div>
      {fetching && <p>Loading...</p>}

      {error && <p>Oh no... {error.message}</p>}

      {data && (
        <ul>
          {(data.pokemons || []).map(pokemon => pokemon && <Pokemon key={pokemon.id} pokemon={pokemon} />)}
        </ul>
      )}
    </div>
  );
};

export default PokemonList;
