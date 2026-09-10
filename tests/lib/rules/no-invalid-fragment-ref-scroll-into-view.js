'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-fragment-ref-scroll-into-view');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('no-invalid-fragment-ref-scroll-into-view', rule, {
  valid: [
    `
      import { Fragment, useRef } from 'react';
      const fragmentRef = useRef(null);
      <Fragment ref={fragmentRef}><div /></Fragment>;
      fragmentRef.current.scrollIntoView();
      fragmentRef.current.scrollIntoView(false);
      fragmentRef.current.scrollIntoView(alignToTop);
    `,
    `
      import * as React from 'react';
      const fragmentRef = React.createRef();
      <React.Fragment ref={fragmentRef}><div /></React.Fragment>;
      fragmentRef.current.scrollIntoView(true);
    `,
    `
      import { Fragment } from 'react';
      const sharedRef = createRef();
      <Fragment ref={sharedRef}><div /></Fragment>;
      <div ref={sharedRef} />;
      sharedRef.current.scrollIntoView({ behavior: 'smooth' });
    `,
    `
      import { Fragment } from 'other';
      const ref = createRef();
      <Fragment ref={ref}><div /></Fragment>;
      ref.current.scrollIntoView({ behavior: 'smooth' });
    `,
    `
      const divRef = createRef();
      <div ref={divRef} />;
      divRef.current.scrollIntoView({ behavior: 'smooth' });
    `,
  ],
  invalid: [
    {
      code: `
        import { Fragment, useRef } from 'react';
        const fragmentRef = useRef(null);
        <Fragment ref={fragmentRef}><div /></Fragment>;
        fragmentRef.current.scrollIntoView({ behavior: 'smooth' });
      `,
      errors: [{ messageId: 'invalidArgument' }],
    },
    {
      code: `
        const { Fragment: Group } = require('react');
        const fragmentRef = createRef();
        <Group ref={fragmentRef}><span /></Group>;
        fragmentRef.current.scrollIntoView('smooth');
      `,
      errors: [{ messageId: 'invalidArgument' }],
    },
    {
      code: `
        import React from 'react';
        const fragmentRef = React.createRef();
        fragmentRef.current.scrollIntoView([]);
        <React.Fragment ref={fragmentRef}><div /></React.Fragment>;
      `,
      errors: [{ messageId: 'invalidArgument' }],
    },
  ],
});
