//
//  react-native-orientation-locker
//
//
//  Created by Wonday on 17/5/12.
//  Copyright (c) wonday.org All rights reserved.
//

"use strict";

import { TurboModuleRegistry } from "react-native";
var OrientationNative = TurboModuleRegistry ? 
TurboModuleRegistry.get('OreitationLockerNativeModule') :
require('react-native').NativeModules.Orientation;
var deviceEventEmitter = require('react-native').DeviceEventEmitter;

var listeners = {};

var id = 0;
var META = "__listener_id";

var locked = false;

function getKey(listener) {
  if (!listener.hasOwnProperty(META)) {
    if (!Object.isExtensible(listener)) {
      return "F";
    }
    Object.defineProperty(listener, META, {
      value: "L" + (id+1)
    });
  }
  return listener[META];
}

export default class Orientation {
  static configure = (options) => {
    // OrientationNative.configure(options);
  };

  static getOrientation = cb => {
    OrientationNative.getOrientation(orientation => {
      cb(orientation);
    });
  };

  static getDeviceOrientation = cb => {
    OrientationNative.getDeviceOrientation(deviceOrientation => {
      cb(deviceOrientation);
    });
  };

  static isLocked = () => {
    return locked;
  };

  static lockToPortrait = () => {
    locked = true;
    OrientationNative.lockToPortrait();
  };

  static lockToPortraitUpsideDown = () => {
    locked = true;
    OrientationNative.lockToPortraitUpsideDown();
  };

  static lockToLandscape = () => {
    locked = true;
    OrientationNative.lockToLandscape();
  };

  static lockToLandscapeRight = () => {
    locked = true;
    OrientationNative.lockToLandscapeRight();
  };

  static lockToLandscapeLeft = () => {
    locked = true;
    OrientationNative.lockToLandscapeLeft();
  };

  // OrientationMaskAllButUpsideDown
  static lockToAllOrientationsButUpsideDown = () => {
    locked = true;
    OrientationNative.lockToAllOrientationsButUpsideDown();
  };

  static unlockAllOrientations = () => {
    locked = false;
    OrientationNative.unlockAllOrientations();
  };

  static addOrientationListener = cb => {
    var key = getKey(cb);
    listeners[key] = deviceEventEmitter.addListener(
      "orientationDidChange",
      body => {
        cb(body.orientation);
      }
    );
  };

  static removeOrientationListener = cb => {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  };

  static addDeviceOrientationListener = cb => {
    var key = getKey(cb);
    listeners[key] = deviceEventEmitter.addListener(
      "deviceOrientationDidChange",
      body => {
        cb(body.deviceOrientation);
      }
    );
  };

  static removeDeviceOrientationListener = cb => {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  };

  static addLockListener = cb => {
    var key = getKey(cb);
    listeners[key] = deviceEventEmitter.addListener("lockDidChange", body => {
      cb(body.orientation);
    });
  };

  static removeLockListener = cb => {
    var key = getKey(cb);
    if (!listeners[key]) {
      return;
    }
    listeners[key].remove();
    listeners[key] = null;
  };

  static removeAllListeners = () => {
    for (var key in listeners) {
      if (!listeners[key]) {
        continue;
      }
      listeners[key].remove();
      listeners[key] = null;
    }
  };

  static getInitialOrientation = () => {
    //暂时注释
    return OrientationNative.initialOrientation;
    // return 'PORTRAIT';
  };

  static getAutoRotateState = cb => {
    cb(true); // iOS not implement
  };
}
