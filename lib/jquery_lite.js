/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	const DOMNodeCollection = __webpack_require__(1);

	const docReadyCallbacks = [
	  bindGiphyEventListener,
	  addGiphyRemoveEvent,
	  bindSentenceEventListener,
	  bindSentenceToggle
	];

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

	$l.extend = (obj1, ...objArgs) => {
	  Object.assign(obj1, ...objArgs);
	  return obj1;
	};

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

	function toQueryString(obj) {
	  let result = "";
	  for(let prop in obj){
	    if (obj.hasOwnProperty(prop)){
	      result += prop + "=" + obj[prop] + "&";
	    }
	  }
	  return result.substring(0, result.length - 1);
	}

	function registerCallbackFunction(func) {
	  if (document.readyState === "complete") {
	    func();
	  } else {
	    docReadyCallbacks.push(func);
	  }
	}

	function bindGiphyEventListener() {
	  $l('button.get-gif').on("click", function() {
	    let sampleGiphyReq = {
	      method: 'GET',
	      url: 'https://api.giphy.com/v1/gifs/random?api_key=dc6zaTOxFJmzC',
	      success: ({data}) => handleGiphyResponse(data),
	    };

	    $l.ajax(sampleGiphyReq);
	  });
	}

	function handleGiphyResponse(data) {
	  let li = $l(document.createElement('li'));

	  let img = $l(document.createElement('img'));
	  img.attr({
	    src: data.image_original_url,
	    class: 'gif'
	  });
	  $l('div.gif-container').append(img);
	}

	function addGiphyRemoveEvent() {
	  $l('button.remove-gif').on("click", function() {
	    $l('img.gif').remove();
	  });
	}

	function removeGif() {
	  $l('img.gif').remove();
	}

	function addSentence() {
	  let liElement = $l(document.createElement('li'));
	  let liNum = $l('li').htmlElements.length + 1;
	  liElement.html(`This is sentence number ${liNum}`);
	  $l('ul.list').append(liElement);
	}

	function bindSentenceEventListener() {
	  $l('button.add-li').on("click", function() {
	    addSentence();
	  });

	  $l('button.clear-li').on("click", function() {
	    clearSentences();
	  });
	}

	function clearSentences() {
	  $l('li').remove();
	}

	function toggleSentClass() {
	  let liElements = $l('li');
	  if (liElements.attr('class') === 'styled') {
	    $l('li').removeClass('styled');
	  } else {
	    $l('li').addClass('styled');
	  }
	}

	function bindSentenceToggle() {
	  $l('button#beautify').on("click", function() {
	    toggleSentClass();
	  });
	}

	document.addEventListener("DOMContentLoaded", () => {
	  docReadyCallbacks.forEach(func => func());
	});

	window.$l = $l;


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = class DOMNodeCollection {
	  constructor(htmlElements) {
	    this.htmlElements = htmlElements;
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


/***/ }
/******/ ]);
