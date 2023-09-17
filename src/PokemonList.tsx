import React from 'react';
import { gql, useQuery } from 'urql';
import { Pokemon, POKEMON_FRAGMENT } from './Pokemon';

const PokemonsDocument = gql`
  query Pokemons {
    pokemons(limit: 1) {
      id
      __typename
      ...PokemonFields
    }
  }

  ${POKEMON_FRAGMENT}
` as typeof import('./PokemonList.generated').PokemonsDocument

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
