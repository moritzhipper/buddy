/* eslint-disable */
export default {
   displayName: 'buddy_frontend',
   preset: '../../jest.preset.js',
   setupFilesAfterEnv: ['<rootDir>/src/test-setup.ts'],
   coverageDirectory: '../../coverage/apps/buddy_frontend',
   transform: {
      '^.+\\.(ts|mjs|js|html)$': [
         'jest-preset-angular',
         {
            tsconfig: '<rootDir>/tsconfig.spec.json',
            stringifyContentPathRegex: '\\.(html|svg)$',
         },
      ],
   },
   transformIgnorePatterns: ['node_modules/(?!.*\\.mjs$)'],
   snapshotSerializers: [
      'jest-preset-angular/build/serializers/no-ng-attributes',
      'jest-preset-angular/build/serializers/ng-snapshot',
      'jest-preset-angular/build/serializers/html-comment',
   ],
};
