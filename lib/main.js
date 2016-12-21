const DOMNodeCollection = require("./dom_node_collection");

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
