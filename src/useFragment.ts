import { DocumentNode, FragmentDefinitionNode, Kind, SelectionNode } from 'graphql';
import React from 'react';
import { TypedDocumentNode, useClient } from 'urql';

export function set(source: any | Array<any>, key: string, value: any): any {
  return setHelper(
    source,
    value,
    key.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'),
    0
  );
}

function setHelper(
  source: any | Array<any>,
  value: any,
  pathArray: Array<string>,
  currentIndex: number
): any {
  if (currentIndex >= pathArray.length) return value;

  // At this point we could be dealing with a FieldArray
  // so be cautious not to use Stringed keys, if not it's an object.
  const continuedPath: any = setHelper(
    source && source[pathArray[currentIndex]],
    value,
    pathArray,
    currentIndex + 1
  );

  if (!source) {
    if (isNaN(pathArray[currentIndex])) {
      return { [pathArray[currentIndex]]: continuedPath };
    }

    const result: any[] = [];
    result[pathArray[currentIndex]] = continuedPath;
    return result;
  }

  if (Array.isArray(source)) {
    source[pathArray[currentIndex]] = continuedPath;
    return source;
  }

  return Object.assign(source, {
    [pathArray[currentIndex]]: continuedPath,
  });
}

function get(source: any, key: string): any {
  let path = key.replace(/\[("|')?([^\[\]]+)\1\]/g, '.$2').split('.'),
    index = 0;

  while (source && path.length > index) {
    if (Array.isArray(source)) {
      source = source.map(s => s[path[index]]);
      index++;
    } else {
      source = source[path[index++]];
    }
  }

  return source;
}


type Requirements = {
  root: string;
  fields: string[];
}

const FragmentToRequirementsCache = new WeakMap<DocumentNode, Requirements>();

function consolidateShapeWithRequirements(requirements: Requirements, shape: any) {
  if (shape.__typename === requirements.root) {
    const eventualShape = {};
    for (const field of requirements.fields) {
      const data = get(shape, field);
      if (!data) {
        return undefined;
      } else {
        if (Array.isArray(data)) {
          const [parent, child] = field.split('.');
          // TODO: has to go deeper than 2 levlels
          data.forEach((x, i) => set(eventualShape, child ? `${parent}[${i}].${child}` : `${parent}[${i}]`, x))
        } else {
          set(eventualShape, field, data)
        }
      }
    }

    return eventualShape;
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
