# react/jsx-no-key-after-spread

An explicit `key` after a JSX spread can be overwritten when the spread object
also has a `key` property:

```jsx
<Row {...props} key={row.id} />
```

Put the explicit key first:

```jsx
<Row key={row.id} {...props} />
```

The rule does not reorder attributes automatically. Reordering can change the
winner when the spread object contains `key`, so a human must decide whether to
remove the spread key or preserve it.
