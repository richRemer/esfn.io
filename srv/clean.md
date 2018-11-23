Register and execute cleanup functions attached to an object.  Simple API which
can be used to wrap and unify the concept of resource cleanup.

clean - Overview
================
The `clean` function provides a way to facilitate resource cleanup based on
objects without adjusting the objects themselves.

When some dependent resource is created (*e.g.,* DOM event handler, loop created
with `setInterval`, *etc.*), associate a cleanup function which knows how to
disconnect, destroy, or otherwise cleanup the resource to the object for which
the resource was created.  Later – when you are done with the object – the
cleanups can be triggered without knowing the details.

Importing
---------
Importing the `clean` function should be performed by its canonical public URL.
Each unique URL from which the `clean` function is imported will result in an
isolated cleanup namespace.  No cleanups will execute for objects whose cleanups
were attached using different `clean` functions.  By using the canonical public
URL, you ensure your cleanups will play nicely with other projects.

```js
import clean from "https://esfn.io/clean.js";
```

Triggering and Attaching Cleanups
---------------------------------
The `clean` function can be used to both attach cleanups and to trigger attached
cleanups, depending on the arguments passed.  All cleanups are guaranteed to be
executed synchronously, in the order they are added.  If a cleanup function
throws no further cleanups will be called and error will not be handled.

```js
import clean from "https://esfn.io/clean.js";

// contrived example which logs a message when element is clicked
function logOnClick(elem, message) {
    elem.addEventListener("click", onclick);

    clean(elem, () => {
        elem.removeEventListener("click", onclick);
    });

    function onclick() {
        console.log(message);
    }
}

// ... get elem somehow

logOnClick(elem, "foo clicked");        // attaches event handler
clean(elem);                            // removes event handler
```
