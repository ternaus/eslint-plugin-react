'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-uncached-use-promise');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});
const client = '"use client"; import { use } from "react";';

ruleTester.run('no-uncached-use-promise', rule, {
  valid: [
    'import { use } from "react"; function App() { return <div>{use(fetch("/data"))}</div>; }',
    `${client} const promise = fetch("/data"); function App() { return <div>{use(promise)}</div>; }`,
    `${client} function App({ promise }) { return <div>{use(promise)}</div>; }`,
    `${client} function App() { return <div>{use(loadCachedData())}</div>; }`,
    `${client} function App() { return <div>{use(Promise.resolve(existingPromise))}</div>; }`,
    `${client} function App(fetch) { return <div>{use(fetch("/data"))}</div>; }`,
    `${client} function App(Promise) { return <div>{use(new Promise(resolve => resolve(1)))}</div>; }`,
    `${client} function App(use) { return <div>{use(fetch("/data"))}</div>; }`,
    `${client} function App() { return <Child onClick={() => use(fetch("/data"))} />; }`,
    `${client} async function App() { return <div>{use(fetch("/data"))}</div>; }`,
    `${client} use(fetch("/data"));`,
    `${client} function helper() { return use(fetch("/data")); }`,
    `${client} function App() { const promise = existingPromise; return <div>{use(promise)}</div>; }`,
    `${client} function App() { let promise = fetch("/data"); promise = existingPromise; return <div>{use(promise)}</div>; }`,
    `${client} function App() { const promise = other(); return <div>{use(promise)}</div>; }`,
    `${client} function useData() { return use(null); }`,
    `${client} function useData() { return use(); }`,
    `${client} function useData() { return use(globalThis.fetch("/data")); }`,
    `${client} function useData() { return use(new OtherPromise()); }`,
    `${client} function useData() { return use(new fetch()); }`,
    `${client} function useData() { return use(Promise()); }`,
  ],
  invalid: [
    {
      code: `${client} function App() { return <div>{use(fetch("/data"))}</div>; }`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} function App() { return <div>{use(new Promise(resolve => resolve("ok")))}</div>; }`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} const App = () => <div>{use(fetch("/data"))}</div>;`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} function App() { const promise = fetch("/data"); return <div>{use(promise)}</div>; }`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} function App({ enabled }) { if (enabled) { const promise = new Promise(resolve => resolve(1)); return <div>{use(promise)}</div>; } return null; }`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} function useData() { return use(fetch("/data")); }`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: `${client} const useData = () => use(fetch("/data"));`,
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: '"use client"; import React from "react"; export default function () { return <div>{React.use(fetch("/data"))}</div>; }',
      errors: [{ messageId: 'uncached' }],
    },
    {
      code: '"use client"; const { use: read } = require("react"); function App() { return <div>{read(fetch("/data"))}</div>; }',
      errors: [{ messageId: 'uncached' }],
    },
  ],
});
