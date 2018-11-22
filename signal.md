Fire and consume signals sent between objects.  Provides simple yet deceptively
powerful API.

signal - Overview
=================
The `signal` function provides a way to wire up objects together to help build
an event-driven application.  Consumers attach signal handlers to objects, then
when the object is updated, the object can send a signal to all its handlers.
When a signal is fired, the object value is sent to the signal handler.

Importing
---------
Importing the `signal` function should be performed by its canonical public URL.
Each unique URL from which the `signal` function is imported will result in an
isolated signal namespace.  No signals will pass between objects which were
wired up using different `signal` functions.  By using the canonical public URL,
you ensure your signals will play nicely with other projects.

```js
import signal from "https://esfn.io/signal.js";
```

Firing and Handling Signals
---------------------------
The `signal` function can be used to both attach signals and to fire signals,
depending on the arguments passed.  All signals are guaranteed to be delivered
asynchronously and signals which are triggered multiple times are only fired
once when their turn comes up in the event loop.

```js
const obj = {foo: 42};

// attach a signal handler
signal(obj, printFoo);

// change the value and send a signal
obj.foo = 13;
signal(obj);

// the handler receives the object from which the signal was sent
function printFoo(obj) {
    console.log(obj.foo);
}
```

Signal Values
-------------
Normally — as noted in the example above — the object from which a signal was
sent is passed to the handler.  This value can be adjusted by adding a `.valueOf`
method to the object.  If `.valueOf` returns an object with its own `.valueOf`,
this will continue recursively, until a primitive value (one which does not have
its own `.valueOf`) is encountered or until a cycle is detected.

```js
// define object with valueOf.
const obj = {
    foo: 42,
    valueOf() {return this.foo;}
};

// attach a signal handler
signal(obj, console.log);

// change the value and send a signal
obj.foo = 13;
signal(obj);
```
