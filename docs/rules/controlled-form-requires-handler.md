# react/controlled-form-requires-handler

Enforces React 19's controlled-form contract for native `input`, `select`, and
`textarea` elements. It is enabled in `recommended`.

`value` requires `onChange`, `onInput`, `readOnly`, or `disabled`; except that
the non-editable `input` types (`button`, `checkbox`, `hidden`, `image`,
`radio`, `reset`, and `submit`) may use `value` without a handler. `checked`
requires `onChange`, `readOnly`, or `disabled`. A control cannot combine
`value` with `defaultValue`, or `checked` with `defaultChecked`.

## Incorrect

```jsx
<input value="Ada" />

<input type="checkbox" checked onInput={setSubscribed} />

<select value="dark" defaultValue="system" onChange={setTheme} />
```

## Correct

```jsx
<input value={name} onInput={setName} />

<input type="checkbox" checked={subscribed} onChange={setSubscribed} />

<input type="submit" value="Save" />
```

The rule also checks statically proven `React.createElement` calls with a
literal intrinsic element and an object-literal props argument. It skips
PascalCase components, React Native host components, dynamic spreads, and
dynamic element names: those do not have the React DOM contract this rule
enforces.
