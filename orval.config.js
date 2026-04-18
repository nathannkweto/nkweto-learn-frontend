export default {
    nkwetolearn: {
        input: './openapi.yaml',
        output: {
            mode: 'split',
            target: './src/api/generated/endpoints.ts',
            schemas: './src/api/generated/models',
            client: 'axios',
        },
    },
};