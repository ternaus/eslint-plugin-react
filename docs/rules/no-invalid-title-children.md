# react/no-invalid-title-children

Reports multiple children or directly written intrinsic markup in an HTML
`title`. Enabled as an error in `recommended`.

JSX such as `<title>Page {page}</title>` passes a two-element array as
`children`. React expects a single text value and warns about this array.
Use a template literal to combine the parts. See [React's title examples](https://react.dev/reference/react-dom/components/title#use-variables-in-the-title).

## Incorrect

```jsx
<title>Page {page}</title>;
<title>{['Page', page]}</title>;
<title><b>Page</b></title>;
```

## Correct

```jsx
<title>{`Page ${page}`}</title>;
<title>{page}</title>;
<svg><title>Chart {number}</title></svg>;
```

Numbers and other values that React can convert to text are not required to
be string literals. Unknown user components that may render text are allowed.

## Analysis boundary

The rule checks JSX and imported React `createElement` calls. It accounts for
JSX comments and formatting whitespace, reports direct arrays with more than
one element, and recognizes directly nested intrinsic JSX or `createElement`
markup. JSX children or explicit `createElement` child arguments take
precedence over a `children` prop. A missing, `null`, or unshadowed `undefined`
props argument is treated as empty props.

Unknown child values, spreads, computed props, customized built-ins, and
visible SVG/MathML contexts are skipped. A visible SVG `foreignObject`
restores the HTML context. The rule does not follow the rendered tree across
component boundaries, enforce one title for an entire page, or inspect the
output of user components.

No automatic fix is offered: string interpolation can change how nullish,
boolean, or object values are rendered.
