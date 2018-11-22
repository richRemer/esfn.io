Evaluate an object to its primitive value by following a chain of `.valueOf`
calls.

valueOf - Overview
==================
The `valueOf` function handles some extra bookkeeping to make the standard
ECMAScript `.valueOf` implementation more useful.  Normally, `.valueOf` gets
called when an object is used in a value context (*e.g.*, `3 + obj`).  But
unfortunately this does not happen recursively, so care must be taken to unwrap
an underlying value.  Rather than relying on the more limited automatic use of
`.valueOf`, the `valueOf` function can be used to get at a deeper value.

Importing
---------
You may copy the `valueOf` function into your own project or use the canonical
canonical public URL.

```js
import valueOf from "https://esfn.io/value-of.js";
```

Evaluating An Object Value
--------------------------
Simply pass any value to the `valueOf` function to determine its underlying
simple value.

```js
const object = {valueOf() {return 42;}};
const value = valueOf(object);
```
