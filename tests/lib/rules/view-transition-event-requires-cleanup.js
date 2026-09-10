'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/view-transition-event-requires-cleanup');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('view-transition-event-requires-cleanup', rule, {
  valid: [
    `
      import { ViewTransition } from 'react';
      <ViewTransition onEnter={handleEnter}><Page /></ViewTransition>;
    `,
    `
      import { ViewTransition } from 'react';
      <ViewTransition onEnter={(instance) => console.log(instance)}><Page /></ViewTransition>;
    `,
    `
      import { ViewTransition } from 'react';
      <ViewTransition onEnter={(instance) => {
        const animation = instance.new.animate(keyframes);
        return () => animation.cancel();
      }}><Page /></ViewTransition>;
    `,
    `
      import * as React from 'react';
      <React.ViewTransition onExit={(instance) => {
        instance.old.animate(keyframes);
        return cleanup;
      }}><Page /></React.ViewTransition>;
    `,
    `
      import { ViewTransition } from 'other';
      <ViewTransition onEnter={(instance) => instance.new.animate(keyframes)}><Page /></ViewTransition>;
    `,
    `
      import { ViewTransition } from 'react';
      <ViewTransition onClick={(instance) => instance.new.animate(keyframes)}><Page /></ViewTransition>;
    `,
    `
      import { ViewTransition } from 'react';
      <ViewTransition onEnter={(instance) => node.animate(keyframes)}><Page /></ViewTransition>;
    `,
  ],
  invalid: [
    ...['onEnter', 'onExit', 'onShare', 'onUpdate'].map((eventName) => ({
      code: `
        import { ViewTransition } from 'react';
        <ViewTransition ${eventName}={(instance) => instance.new.animate(keyframes)}><Page /></ViewTransition>;
      `,
      errors: [{ messageId: 'missingCleanup' }],
    })),
    {
      code: `
        import { ViewTransition } from 'react';
        <ViewTransition onEnter={(instance) => {
          instance.new.animate(keyframes);
        }}><Page /></ViewTransition>;
      `,
      errors: [{ messageId: 'missingCleanup' }],
    },
    {
      code: `
        import { ViewTransition } from 'react';
        <ViewTransition onEnter={async (instance) => {
          const animation = instance.new.animate(keyframes);
          return () => animation.cancel();
        }}><Page /></ViewTransition>;
      `,
      errors: [{ messageId: 'asyncCleanup' }],
    },
  ],
});
