# HackeyQuery

[HackeyQuery Live](https://wangytangy.github.io/hackeyquery/)

## Overview

Hackey Query is a light Javascript Library that simplifies various HTML document manipulation, traversal, event handling, and AJAX functions. The library consists of methods based on vanilla Javascript and the native DOM API built into every modern browser.

## Here is a list of the major features:

### `$l(selector)`

The `$l` selector accepts a single argument, identifying nodes in the HTML page using `CSS` selectors if the argument is a string. It can also receive an `HTMLElement`, converting it into a `NodeList` array-like object and packages it into a `DOMNodeCollection` class that will make a variety of methods available to it.

```Javascript
//main.js

function $l(arg) {
  switch(typeof(arg)) {
    case "string":
      const htmlElements = Array.from(document.querySelectorAll(arg));
      return new DOMNodeCollection(htmlElements);
    case "object":
      if (arg instanceof HTMLElement) {
        return new DOMNodeCollection([arg]);
      }
      break;
    case "function":
      registerCallbackFunction(arg);
      break;
  }
}
```

### `DOMNodeCollection`

The `DOMNodeCollection` class receives an array of `HTMLElements` and stores it as an instance variable. Class methods defined within `DOMNodeCollection` will be applied to every node in the array, allowing for custom, simplified DOM manipulation.

```Javascript
//dom_node_collection.js

class DOMNodeCollection {
  constructor(htmlElements) {
    this.htmlElements = htmlElements;
  }
}
```

### Appending and Removing Nodes
Appends a node's outerHTML to a parent node's innerHTML. Ensures child nodes are cloned so it can be appended to multiple parent nodes instead of being moved and replaced in each iteration.

```Javascript
//dom_node_collection.js

//DOMNodeCollection class
append(children) {
  if (typeof children === "string") {
    this.htmlElements.forEach((node) => {
      node.innerHTML += children;
    });
  } else if (typeof children === "object") {
    this.htmlElements.forEach((node) => {
      children.htmlElements.forEach((childNode) => {
        node.appendChild(childNode.cloneNode(true));
      });
    });
  }
}
```

### Adding and Removing Event Listeners

The `on` method takes an event type such as `click` or `submit` and a callback function to execute on event activation. The callback is stored in the node's `hackeyQueryEvent` attribute for easy removal by the `off` method without the need to specify the name of the callback function. The `off` method iterates through the array of callbacks for a given event type, removes the event listener and clears the `hackeyQueryEvent` attribute.

```Javascript
//dom_node_collection.js

on(eventType, callback) {
  this.htmlElements.forEach((node) => {
    node.addEventListener(eventType, callback);
    const eventKey = `hackeyQueryEvent-${eventType}`;
    if (node[eventKey] === undefined) {
      node[eventKey] = [];
    }
    node[eventKey].push(callback);
  });
}

off(eventType) {
  this.htmlElements.forEach((node) => {
    const eventKey = `hackeyQueryEvent-${eventType}`;

    if (node[eventKey]) {
      node[eventKey].forEach((callback) => {
        node.removeEventListener(eventType, callback);
      });
    }
    node[eventKey] = [];
  });
}
```
### Searching nodes from a given Parent node

The `find(selector)` method returns a `DOMNodeCollection` instance of all descendant nodes matching the given selector. This allows other `DOMNodeCollection` class methods to be chained on matched nodes for further manipulation.

```Javascript
//dom_node_collection.js

find(selector) {
  let matchedElements = [];
  this.htmlElements.forEach((node) => {
    let matchedNodes = Array.from(node.querySelectorAll(selector));
    matchedElements = matchedElements.concat(matchedNodes);
  });
  return new DOMNodeCollection(matchedElements);
}
```

### Simplified AJAX requests

A simplified `XMLHttpRequest` that takes an options hash in addition to providing sensible default parameters. $l.ajax returns a `Promise` object allowing for chained asynchronous functions without the need to write nested callbacks that invoke the next async call. Simply add the `.then` method, passing in success and error callbacks on the returned `Promise` object.

```Javascript
//main.js

$l.ajax = (options) => {
  return new Promise(function(success, error) {

    const defaults = {
      method: 'GET',
      url: '',
      contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
      dataType: 'json',
      success: () => {},
      error: () => {},
      data: {}
    };

    options = $l.extend(defaults, options);

    const xhr = new XMLHttpRequest();
    xhr.open(options.method, options.url);
    xhr.onload = (e) => {
      if (xhr.status === 200) {
        options.success(JSON.parse(xhr.response));
      } else {
        options.error(xhr.response);
      }
    };

    xhr.send(JSON.stringify(options.data));
  });
};
```

### On Document Ready

The `$l` function can also receive a function. The function will be invoked when the page has loaded. Otherwise it will be passed to `registerCallbackFunction` to be stored in an array (queue) of callback functions to be called when the page is loaded.

```Javascript
//main.js
const docReadyCallbacks = [];

function registerCallbackFunction(func) {
  if (document.readyState === "complete") {
    func();
  } else {
    docReadyCallbacks.push(func);
  }
}

document.addEventListener("DOMContentLoaded", () => {
  docReadyCallbacks.forEach(func => func());
});

```

## Philosophy

The purpose of HackeyQuery is to provide users with a lightweight, cross-browser API to perform common HTML manipulation and traversal functions while greatly reducing the amount of code needed to be written.
