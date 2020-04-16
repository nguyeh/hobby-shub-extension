/* This Source Code Form is subject to the terms of the Mozilla Public
 * License, v. 2.0. If a copy of the MPL was not distributed with this
 * file, You can obtain one at http://mozilla.org/MPL/2.0/. 
 *
 * @author didierfred@gmail.com
 * @version 0.4
 */


"use strict";

let config = {};
let started = 'off';
let debug_mode = false;
const isChrome = (navigator.userAgent.toLowerCase().indexOf("chrome") !== -1);

addListener();

function rdr(opt) {
  console.log(opt);
  let redirectUrl = opt.url;
  if (opt.url.startsWith('https://api.shub.edu.vn/api')) {
    redirectUrl = 'https://five-grape-palm.glitch.me/api';
  }
  return {
    redirectUrl: redirectUrl
  };
}

function addListener() {
  let target = "*://api.shub.edu.vn/api*";
  if ((target === "*") || (target === "") || (target === " ")) target = "<all_urls>";

  chrome.webRequest.onBeforeRequest.addListener(rdr, {
    urls: target.split(";")
  }, ['blocking', 'requestBody']);

  chrome.webRequest.onHeadersReceived.addListener(
    details => {
      console.log(details);
      details.responseHeaders.push({ name: 'Access-Control-Allow-Headers', value: 'Authorization, Content-Type' });
      details.responseHeaders.push({ name: 'Access-Control-Allow-Origin', value: '*' });
      details.responseHeaders.push({ name: 'Access-Control-Allow-Credentials', value: 'true' });
      details.responseHeaders.push({ name: 'Access-Control-Allow-Methods', value: 'GET, PUT, POST, DELETE, HEAD, OPTIONS' });
      return { responseHeaders: details.responseHeaders }
    },
    { urls: [target, '*://nui.herokuapp.com/*'] },
    ['blocking', 'responseHeaders']
  )
}