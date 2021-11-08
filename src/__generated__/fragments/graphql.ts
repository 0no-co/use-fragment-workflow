/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

/** Move a Pokémon can perform with the associated damage and type. */
export type Attack = {
  __typename?: 'Attack';
  name?: Maybe<Scalars['String']>;
  type?: Maybe<PokemonType>;
  damage?: Maybe<Scalars['Int']>;
};

export type AttacksConnection = {
  __typename?: 'AttacksConnection';
  fast?: Maybe<Array<Maybe<Attack>>>;
  special?: Maybe<Array<Maybe<Attack>>>;
};

/** Requirement that prevents an evolution through regular means of levelling up. */
export type EvolutionRequirement = {
  __typename?: 'EvolutionRequirement';
  amount?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
};

export type Pokemon = {
  __typename?: 'Pokemon';
  id: Scalars['ID'];
  name: Scalars['String'];
  classification?: Maybe<Scalars['String']>;
  types?: Maybe<Array<Maybe<PokemonType>>>;
  resistant?: Maybe<Array<Maybe<PokemonType>>>;
  weaknesses?: Maybe<Array<Maybe<PokemonType>>>;
  evolutionRequirements?: Maybe<Array<Maybe<EvolutionRequirement>>>;
  weight?: Maybe<PokemonDimension>;
  height?: Maybe<PokemonDimension>;
  attacks?: Maybe<AttacksConnection>;
  /** Likelihood of an attempt to catch a Pokémon to fail. */
  fleeRate?: Maybe<Scalars['Float']>;
  /** Maximum combat power a Pokémon may achieve at max level. */
  maxCP?: Maybe<Scalars['Int']>;
  /** Maximum health points a Pokémon may achieve at max level. */
  maxHP?: Maybe<Scalars['Int']>;
  evolutions?: Maybe<Array<Maybe<Pokemon>>>;
};

export type PokemonDimension = {
  __typename?: 'PokemonDimension';
  minimum?: Maybe<Scalars['String']>;
  maximum?: Maybe<Scalars['String']>;
};

/** Elemental property associated with either a Pokémon or one of their moves. */
export enum PokemonType {
  Grass = 'Grass',
  Poison = 'Poison',
  Fire = 'Fire',
  Flying = 'Flying',
  Water = 'Water',
  Bug = 'Bug',
  Normal = 'Normal',
  Electric = 'Electric',
  Ground = 'Ground',
  Fairy = 'Fairy',
  Fighting = 'Fighting',
  Psychic = 'Psychic',
  Rock = 'Rock',
  Steel = 'Steel',
  Ice = 'Ice',
  Ghost = 'Ghost',
  Dragon = 'Dragon',
  Dark = 'Dark'
}

export type Query = {
  __typename?: 'Query';
  /** List out all Pokémon, optionally in pages */
  pokemons?: Maybe<Array<Maybe<Pokemon>>>;
  /** Get a single Pokémon by its ID, a three character long identifier padded with zeroes */
  pokemon?: Maybe<Pokemon>;
};


export type QueryPokemonsArgs = {
  limit?: Maybe<Scalars['Int']>;
  skip?: Maybe<Scalars['Int']>;
};


export type QueryPokemonArgs = {
  id: Scalars['ID'];
};

export type PokemonFieldsFragment = { __typename?: 'Pokemon', name: string, classification?: string | null | undefined, maxHP?: number | null | undefined, maxCP?: number | null | undefined, types?: Array<PokemonType | null | undefined> | null | undefined, weight?: { __typename?: 'PokemonDimension', minimum?: string | null | undefined, maximum?: string | null | undefined } | null | undefined, evolutions?: Array<{ __typename?: 'Pokemon', id: string, name: string, evolutions?: Array<{ __typename?: 'Pokemon', id: string, name: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export type PokemonsQueryVariables = Exact<{ [key: string]: never; }>;


export type PokemonsQuery = { __typename?: 'Query', pokemons?: Array<{ __typename: 'Pokemon', id: string, name: string, classification?: string | null | undefined, maxHP?: number | null | undefined, maxCP?: number | null | undefined, types?: Array<PokemonType | null | undefined> | null | undefined, weight?: { __typename?: 'PokemonDimension', minimum?: string | null | undefined, maximum?: string | null | undefined } | null | undefined, evolutions?: Array<{ __typename?: 'Pokemon', id: string, name: string, evolutions?: Array<{ __typename?: 'Pokemon', id: string, name: string } | null | undefined> | null | undefined } | null | undefined> | null | undefined } | null | undefined> | null | undefined };

export const PokemonFieldsFragmentDoc = {"kind":"Document","definitions":[{"kind":"FragmentDefinition","name":{"kind":"Name","value":"PokemonFields"},"typeCondition":{"kind":"NamedType","name":{"kind":"Name","value":"Pokemon"}},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"classification"}},{"kind":"Field","name":{"kind":"Name","value":"maxHP"}},{"kind":"Field","name":{"kind":"Name","value":"maxCP"}},{"kind":"Field","name":{"kind":"Name","value":"types"}},{"kind":"Field","name":{"kind":"Name","value":"weight"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"minimum"}},{"kind":"Field","name":{"kind":"Name","value":"maximum"}}]}},{"kind":"Field","name":{"kind":"Name","value":"evolutions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"evolutions"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]} as unknown as DocumentNode<PokemonFieldsFragment, unknown>;
export const PokemonsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"Pokemons"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"pokemons"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"limit"},"value":{"kind":"IntValue","value":"1"}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"__typename"}},{"kind":"FragmentSpread","name":{"kind":"Name","value":"PokemonFields"}}]}}]}},...PokemonFieldsFragmentDoc.definitions]} as unknown as DocumentNode<PokemonsQuery, PokemonsQueryVariables>;