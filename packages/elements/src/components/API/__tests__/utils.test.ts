import { OpenAPIObject } from 'openapi3-ts';

import { transformOasToServiceNode } from '../../../utils/oas';
import { computeAPITree, computeTagGroups } from '../utils';

describe('computeTagGroups', () => {
  it('orders endpoints according to specificed tags', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      tags: [
        {
          name: 'beta',
        },
        {
          name: 'alpha',
        },
      ],
      paths: {
        '/a': {
          get: {
            tags: ['alpha'],
          },
        },
        '/b': {
          get: {
            tags: ['beta'],
          },
        },
      },
    };

    const serviceNode = transformOasToServiceNode(apiDocument);
    expect(serviceNode ? computeTagGroups(serviceNode) : null).toEqual({
      groups: [
        {
          title: 'beta',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/b/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/b',
                responses: [],
                servers: [],
                request: {
                  body: {
                    contents: [],
                  },
                  headers: [],
                  query: [],
                  cookie: [],
                  path: [],
                },
                tags: [
                  {
                    name: 'beta',
                  },
                ],
                security: [],
              },
              name: '/b',
              tags: ['beta'],
            },
          ],
        },
        {
          title: 'alpha',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/a/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/a',
                responses: [],
                servers: [],
                request: {
                  body: {
                    contents: [],
                  },
                  headers: [],
                  query: [],
                  cookie: [],
                  path: [],
                },
                tags: [
                  {
                    name: 'alpha',
                  },
                ],
                security: [],
              },
              name: '/a',
              tags: ['alpha'],
            },
          ],
        },
      ],
      ungrouped: [],
    });
  });

  it("within the tags it doesn't reorder the endpoints", () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      tags: [
        {
          name: 'beta',
        },
        {
          name: 'alpha',
        },
      ],
      paths: {
        '/a': {
          get: {
            tags: ['alpha'],
          },
        },
        '/c': {
          get: {
            tags: ['beta'],
          },
        },
        '/b': {
          get: {
            tags: ['beta'],
          },
        },
      },
    };

    const serviceNode = transformOasToServiceNode(apiDocument);
    expect(serviceNode ? computeTagGroups(serviceNode) : null).toEqual({
      groups: [
        {
          title: 'beta',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/c/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/c',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'beta' }],
                security: [],
              },
              name: '/c',
              tags: ['beta'],
            },
            {
              type: 'http_operation',
              uri: '/paths/b/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/b',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'beta' }],
                security: [],
              },
              name: '/b',
              tags: ['beta'],
            },
          ],
        },
        {
          title: 'alpha',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/a/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/a',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'alpha' }],
                security: [],
              },
              name: '/a',
              tags: ['alpha'],
            },
          ],
        },
      ],
      ungrouped: [],
    });
  });

  it("within the tags it doesn't reorder the methods", () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      tags: [
        {
          name: 'beta',
        },
        {
          name: 'alpha',
        },
      ],
      paths: {
        '/a': {
          get: {
            tags: ['alpha'],
          },
        },
        '/b': {
          get: {
            tags: ['beta'],
          },
          delete: {
            tags: ['beta'],
          },
        },
      },
    };

    const serviceNode = transformOasToServiceNode(apiDocument);
    expect(serviceNode ? computeTagGroups(serviceNode) : null).toEqual({
      groups: [
        {
          title: 'beta',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/b/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/b',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'beta' }],
                security: [],
              },
              name: '/b',
              tags: ['beta'],
            },
            {
              type: 'http_operation',
              uri: '/paths/b/delete',
              data: {
                id: '?http-operation-id?',
                method: 'delete',
                path: '/b',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'beta' }],
                security: [],
              },
              name: '/b',
              tags: ['beta'],
            },
          ],
        },
        {
          title: 'alpha',
          items: [
            {
              type: 'http_operation',
              uri: '/paths/a/get',
              data: {
                id: '?http-operation-id?',
                method: 'get',
                path: '/a',
                responses: [],
                servers: [],
                request: { body: { contents: [] }, headers: [], query: [], cookie: [], path: [] },
                tags: [{ name: 'alpha' }],
                security: [],
              },
              name: '/a',
              tags: ['alpha'],
            },
          ],
        },
      ],
      ungrouped: [],
    });
  });

  it("doesn't throw with incorrect tags value", () => {
    const apiDocument = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      paths: {},
      tags: {
        $ref: './tags',
      },
    };

    const serviceNode = transformOasToServiceNode(apiDocument);
    expect(serviceNode ? computeTagGroups(serviceNode) : null).toEqual({ groups: [], ungrouped: [] });
  });
});

describe('computeAPITree', () => {
  it('generates API ToC tree', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      paths: {
        '/something': {
          get: {
            responses: {
              200: {
                schema: { $ref: '#/definitions/schemas/ImportantSchema' },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          ImportantSchema: {
            type: 'object',
            properties: {
              a: { type: 'string' },
            },
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!)).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
      {
        title: 'Endpoints',
      },
      {
        id: '/paths/something/get',
        meta: 'get',
        slug: '/paths/something/get',
        title: '/something',
        type: 'http_operation',
      },
      { title: 'Schemas' },
      {
        id: '/schemas/ImportantSchema',
        slug: '/schemas/ImportantSchema',
        title: 'ImportantSchema',
        type: 'model',
        meta: '',
      },
    ]);
  });

  it('allows to hide schemas from ToC', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      paths: {
        '/something': {
          get: {
            responses: {
              200: {
                schema: { $ref: '#/definitions/schemas/ImportantSchema' },
              },
            },
          },
        },
      },
      components: {
        schemas: {
          ImportantSchema: {
            type: 'object',
            properties: {
              a: { type: 'string' },
            },
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!, { hideSchemas: true })).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
      {
        title: 'Endpoints',
      },
      {
        id: '/paths/something/get',
        meta: 'get',
        slug: '/paths/something/get',
        title: '/something',
        type: 'http_operation',
      },
    ]);
  });

  it('allows to hide internal operations from ToC', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      paths: {
        '/something': {
          get: {},
          post: {
            'x-internal': true,
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!, { hideInternal: true })).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
      {
        title: 'Endpoints',
      },
      {
        id: '/paths/something/get',
        meta: 'get',
        slug: '/paths/something/get',
        title: '/something',
        type: 'http_operation',
      },
    ]);
  });

  it('allows to hide nested internal operations from ToC', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      tags: [
        {
          name: 'a',
        },
      ],
      paths: {
        '/something': {
          get: {
            tags: ['a'],
          },
          post: {
            'x-internal': true,
            tags: ['a'],
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!, { hideInternal: true })).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
      {
        title: 'Endpoints',
      },
      {
        title: 'a',
        items: [
          {
            id: '/paths/something/get',
            meta: 'get',
            slug: '/paths/something/get',
            title: '/something',
            type: 'http_operation',
          },
        ],
      },
    ]);
  });

  it('allows to hide internal models from ToC', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      paths: {},
      components: {
        schemas: {
          SomeInternalSchema: {
            'x-internal': true,
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!, { hideInternal: true })).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
    ]);
  });

  it('excludes groups with no items', () => {
    const apiDocument: OpenAPIObject = {
      openapi: '3.0.0',
      info: {
        title: 'some api',
        version: '1.0.0',
        description: 'some description',
      },
      tags: [
        {
          name: 'a',
        },
      ],
      paths: {
        '/something': {
          post: {
            'x-internal': true,
            tags: ['a'],
          },
        },
        '/something-else': {
          post: {
            tags: ['b'],
          },
        },
      },
    };

    expect(computeAPITree(transformOasToServiceNode(apiDocument)!, { hideInternal: true })).toEqual([
      {
        id: '/',
        meta: '',
        slug: '/',
        title: 'Overview',
        type: 'overview',
      },
      {
        title: 'Endpoints',
      },
      {
        title: 'b',
        items: [
          {
            id: '/paths/something-else/post',
            meta: 'post',
            slug: '/paths/something-else/post',
            title: '/something-else',
            type: 'http_operation',
          },
        ],
      },
    ]);
  });
});
