import React from 'react';
import { useQuery, gql } from 'urql';
import { Pokemon, POKEMON_FRAGMENT } from './Pokemon';

export const POKEMONS_QUERY = gql(/* GraphQL */`
  query Pokemons {
    pokemons(limit: 1) {
      id
      __typename
      ...PokemonFields
    }
  }

  ${POKEMON_FRAGMENT}
`);

const PokemonList = () => {
  const [result] = useQuery({ query: POKEMONS_QUERY });

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
