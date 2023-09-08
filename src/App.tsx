
import React from 'react';
import { createClient, fetchExchange, Provider } from 'urql';
import { cacheExchange } from '@urql/exchange-graphcache';
import PokemonList from './PokemonList';
import json from '../introspection.json'

const cache = cacheExchange({
  schema: json as any
})

const client = createClient({
  url: 'https://trygql.formidable.dev/graphql/basic-pokedex',
  exchanges: [cache, fetchExchange]
});

function App() {
  return (
    <Provider value={client}>
      <PokemonList />
    </Provider>
  );
}

export default App;
