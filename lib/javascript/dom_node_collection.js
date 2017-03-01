module.exports = class DOMNodeCollection {
  constructor(htmlElements) {
    this.htmlElements = htmlElements;
  }

  each(fn) {
    this.htmlElements.forEach((node) => {
      fn(node);
    });
    return this.htmlElements;
  }

  html(string = null) {
    if (string) {
      this.htmlElements.forEach((node) => {
        node.innerHTML = string;
      });
    } else {
      return this.htmlElements[0].innerHTML;
    }
  }

  empty() {
    this.htmlElements.forEach((node) => {
      node.innerHTML = "";
    });
  }

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

  attr(name, value = null) {

    if (typeof name === "object") {
      this.htmlElements.forEach((node) => {
        Object.keys(name).forEach((key) => {
          node.setAttribute(key, name[key]);
        });
      });
    }

    if (value) {
      this.htmlElements.forEach((node) => {
        node.setAttribute(name, value);
      });
    } else {
      return this.htmlElements[0].getAttribute(name);
    }
  }

  addClass(className) {
    this.htmlElements.forEach((node) => {
      node.classList.add(className);
    });
  }

  removeClass(className) {
    this.htmlElements.forEach((node) => {
      node.classList.remove(className);
    });
  }

  children() {
    const allChildren = [];
    this.htmlElements.forEach((node) => {
      Array.from(node.children).forEach((child) => {
        allChildren.push(child);
      });
    });
    return new DOMNodeCollection(allChildren);
  }

  parent() {
    const allParents = [];
    this.htmlElements.forEach((node) => {
      allParents.push(node.parentNode);
    });
    return new DOMNodeCollection(allParents);
  }

  find(selector) {
    let matchedElements = [];
    this.htmlElements.forEach((node) => {
      let matchedNodes = Array.from(node.querySelectorAll(selector));
      matchedElements = matchedElements.concat(matchedNodes);
    });
    return new DOMNodeCollection(matchedElements);
  }

  remove() {
    this.htmlElements.forEach((node) => {
      node.parentNode.removeChild(node);
    });
  }

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

};
