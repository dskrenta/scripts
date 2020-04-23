'use strict';

const events = {};

const eventEmitter = {
  emit: function(event, data) {
    // Your code here
    if (event in events) {
        for (let someEvent of events[event]) {
            someEvent(data);
        }
    }
  },
  subscribe: function(event, callback) {
    // Your code here
    if (event in events) {
        events[event].push(callback);
    }
    else {
        events[event] = [callback];
    }
  }
}

var errorCallback = function(data) {
  console.log("Error 1. " + data.message);
}

var errorCallback2 = function(data) {
  console.log("Error 2. " + data.message);
}

var successCallback = function(data) {
  console.log("SUCCESS! " + data.message);
}

eventEmitter.emit("error", {message: "Error one."});
eventEmitter.subscribe("error", errorCallback);
eventEmitter.emit("error", {message: "Second error."});
eventEmitter.subscribe("error", errorCallback2);
eventEmitter.emit("error", {message: "Yet another error."});
eventEmitter.subscribe("success", successCallback);
eventEmitter.emit("success", {message: "Great success!"});
