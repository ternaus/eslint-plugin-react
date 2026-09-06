'use strict';

const RuleTester = require('../../helpers/ruleTester');
const rule = require('../../../lib/rules/no-invalid-form-action');

const ruleTester = new RuleTester({
  parserOptions: { ecmaFeatures: { jsx: true }, ecmaVersion: 2024, sourceType: 'module' },
});

ruleTester.run('no-invalid-form-action', rule, {
  valid: [
    '<form action="/save" method="get" encType="multipart/form-data" target="preview" />',
    '<form action={null} method="get" />',
    '<form method="post" />',
    '<form action={async () => {}} method={null} target={undefined} />',
    '<form action={async () => {}} method={maybeMethod} />',
    '<form action={async () => {}} {...props} method="get" />',
    '<form is="custom-form" action={async () => {}} method="get" />',
    '<Button type="button" formAction={async () => {}} />',
    '<custom-form action={async () => {}} method="get" />',
    '<button type="submit" name="operation" formAction="/save" />',
    '<button formAction={async () => {}} />',
    '<button type={null} formAction={async () => {}} />',
    '<input type="image" formAction={async () => {}} />',
    '<input type={type} formAction={async () => {}} />',
    '<button type="button" formAction={possiblyNull} />',
    'import { save } from "./actions.js"; <form action={save} method="get" />;',
    'let save = () => {}; save = "/save"; <form action={save} method="get" />;',
    'const save = "/save"; <form action={save} method="get" />;',
    'function save() {} save = "/save"; <form action={save} method="get" />;',
    'function Form(save) { return <form action={save} method="get" />; }',
    'import { useActionState } from "react"; const [state, action] = useActionState(save, ""); <form action={state} method="get" />;',
    'const [state, action] = anotherHook(); <form action={action} method="get" />;',
    '<svg><form action={async () => {}} method="get" /></svg>',
    'React.createElement("form", { action: () => {}, method: "get" });',
    'import React from "react"; React.createElement("form", props);',
    'import React from "react"; React.createElement("form", { action: () => {}, method: "get", ...props });',
    'import React from "react"; React.createElement("form", { action: () => {}, method: "get", [key]: value });',
    'import React from "react"; React.createElement("form", { get action() { return save; }, method: "get" });',
    'import React from "react"; React.createElement("div", { action: () => {}, method: "get" });',
  ],
  invalid: [
    ...['method', 'encType', 'target'].map((prop) => ({
      code: `<form action={async () => {}} ${prop}="value" />`,
      errors: [{ messageId: 'overridden', data: { prop, action: 'action' } }],
    })),
    ...['name', 'formMethod', 'formEncType', 'formTarget'].map((prop) => ({
      code: `<button type="submit" formAction={() => {}} ${prop}="value" />`,
      errors: [{ messageId: 'overridden', data: { prop, action: 'formAction' } }],
    })),
    {
      code: '<input type="submit" name="operation" formAction={function () {}} />',
      errors: [{ messageId: 'overridden', data: { prop: 'name', action: 'formAction' } }],
    },
    {
      code: '<button type="button" formAction={async () => {}} />',
      errors: [{ messageId: 'buttonType' }],
    },
    {
      code: '<input formAction="/save" />',
      errors: [{ messageId: 'inputType' }],
    },
    {
      code: '<input type="text" formAction={async () => {}} />',
      errors: [{ messageId: 'inputType' }],
    },
    {
      code: 'async function save() {} <form action={save} method="get" />;',
      errors: [{ messageId: 'overridden', data: { prop: 'method', action: 'action' } }],
    },
    {
      code: 'const save = async () => {}; const method = "get"; <form action={save} method={method} />;',
      errors: [{ messageId: 'overridden', data: { prop: 'method', action: 'action' } }],
    },
    {
      code: 'const save = function () {}; <form action={save} target={`preview`} />;',
      errors: [{ messageId: 'overridden', data: { prop: 'target', action: 'action' } }],
    },
    {
      code: 'import { useActionState as useAction } from "react"; const [state, submit] = useAction(save, null); <form action={submit} method="get" />;',
      errors: [{ messageId: 'overridden', data: { prop: 'method', action: 'action' } }],
    },
    {
      code: 'import React from "react"; React.createElement("form", { action: () => {}, "method": "get", target: "preview" });',
      errors: [
        { messageId: 'overridden', data: { prop: 'method', action: 'action' } },
        { messageId: 'overridden', data: { prop: 'target', action: 'action' } },
      ],
    },
    {
      code: 'const { createElement: element } = require("react"); element("button", { type: "reset", formAction: "/save" });',
      errors: [{ messageId: 'buttonType' }],
    },
    {
      code: '<svg><foreignObject><form action={() => {}} method="get" /></foreignObject></svg>',
      errors: [{ messageId: 'overridden', data: { prop: 'method', action: 'action' } }],
    },
  ],
});
