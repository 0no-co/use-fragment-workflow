import { DocumentNode, FragmentDefinitionNode, Kind, SelectionNode } from 'graphql';
import React from 'react';
import { TypedDocumentNode, useClient } from 'urql';

const getNestedData = (source: any, keys: string[], data: any) => {
  const firstElement = keys.shift();
  if (!keys.length) {
    return data[firstElement] = source ? source[firstElement] : source;
  }

  const d = source[firstElement];
  if (Array.isArray(d)) {
    if (!data[firstElement]) data[firstElement] = [];
    return d.forEach((_, i) => getNestedData(d, [i, ...keys], data[firstElement]));
  } else {
    if (!data[firstElement]) data[firstElement] = {};
    return getNestedData(source[firstElement], keys, data[firstElement]);
  }
}

const getData = (source: any, keys: string[]): any => {
  const data = {};
  keys.forEach((key) => {
    getNestedData(source, key.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'), data)
  });

  return data;
}

type Requirements = {
  root: string;
  fields: string[];
}

const FragmentToRequirementsCache = new WeakMap<DocumentNode, Requirements>();

function consolidateShapeWithRequirements(requirements: Requirements, shape: any) {
  if (shape.__typename === requirements.root) {
    return getData(shape, requirements.fields);
  }

  throw new Error('Wrong fragment shape');
}

function getInformation(field: SelectionNode, parent?: string): string[] | string {
  switch (field.kind) {
    case Kind.FIELD: {
      if (field.selectionSet) {
        return field.selectionSet.selections.reduce<string[]>((acc, childField) => {
          const f = getInformation(childField, parent ? `${parent}.${field.name.value}` : field.name.value);
          Array.isArray(f) ? acc.push(...f) : acc.push(f);
          return acc;
        }, []);
      } else {
        return parent ? `${parent}.${field.name.value}` : field.name.value
      }
    }
  }

  return '';
}

export function useFragment<Data = any>(fragmentDoc: DocumentNode | TypedDocumentNode<Data>, shape: object): Data {
  const client = useClient();

  const requirements = React.useMemo(() => {
    if (!FragmentToRequirementsCache.get(fragmentDoc)) {
      const fragmentDefinition = fragmentDoc.definitions[0] as FragmentDefinitionNode;

      // TODO: should we handle nested fragments here?
      FragmentToRequirementsCache.set(fragmentDoc, {
        root: fragmentDefinition.typeCondition.name.value,
        fields: fragmentDefinition.selectionSet.selections.reduce<string[]>((acc, field) => {
          const f = getInformation(field);
          Array.isArray(f) ? acc.push(...f) : acc.push(f);
          return acc;
        }, []),
      })
    }

    return FragmentToRequirementsCache.get(fragmentDoc) as Requirements;
  }, [fragmentDoc]);

  const dataOrSource = React.useMemo(() => {
    console.log(client)

    if (shape) {
      const result = consolidateShapeWithRequirements(requirements, shape);
      if (result) return result;
    }

    // Look for activeOperations that contain this fragment in the query
    // client.activeOperations.find(queryHasFragmentDoc) --> if not found throw error
    // Create suspense-source that listens to the active-operation
  }, [requirements, JSON.stringify(shape), client]);

  return dataOrSource as Data;
}
