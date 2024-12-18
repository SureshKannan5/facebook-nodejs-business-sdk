/**
 * Copyright (c) 2017-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @format
 */
import Api from "./api";
import HTTP_STATUS from "./http-status";
const axios = require("axios");

/**
 * Isomorphic Http Promise Requests Class
 * @flow
 */
export default class Http {
  /**
   * Request
   * @param   {String}  method
   * @param   {String}  url
   * @param   {Object}  [data]
   * @return  {Promise}
   */
  static request(
    method: string,
    url: string,
    data: Object,
    files: Object,
    useMultipartFormData: Boolean,
    showHeader: Boolean
  ): Promise<*> {
    if (typeof window !== "undefined" && window.XMLHttpRequest) {
      return Http.xmlHttpRequest(method, url, data);
    }
    return Http.requestPromise(
      method,
      url,
      data,
      files,
      useMultipartFormData,
      showHeader
    );
  }

  /**
   * XmlHttpRequest request
   * @param   {String}  method
   * @param   {String}  url
   * @param   {Object}  [data]
   * @return  {Promise}
   */
  static xmlHttpRequest(method, url, data): Promise<*> {
    return new Promise((resolve, reject) => {
      const request = new window.XMLHttpRequest();
      request.open(method, url);
      request.onload = function () {
        try {
          const response = JSON.parse(request.response);

          if (request.status.toString() === HTTP_STATUS.OK) {
            resolve(response);
          } else {
            reject(
              new Error({
                body: response,
                status: request.status,
              })
            );
          }
        } catch (e) {
          reject(
            new Error({
              body: request.responseText,
              status: request.status,
            })
          );
        }
      };
      request.setRequestHeader("Content-Type", "application/json");
      request.setRequestHeader("Accept", "application/json");
      request.send(JSON.stringify(data));
    });
  }

  /**
   * Request Promise
   * @param   {String}  method The HTTP method name (e.g. 'GET').
   * @param   {String}  url A full URL string.
   * @param   {Object}  [data] A mapping of request parameters where a key
   *   is the parameter name and its value is a string or an object
   *   which can be JSON-encoded.
   * @param   {Object}  [files] An optional mapping of file names to ReadStream
   *   objects. These files will be attached to the request.
   * @param   {Boolean} [useMultipartFormData] An optional flag to call with
   *   multipart/form-data.
   * @return  {Promise}
   */
  static requestPromise(
    method: string,
    url: string,
    data: Object,
    files: Object,
    useMultipartFormData: Boolean = false,
    showHeader: Boolean = false
  ): Promise<*> {
    var options = {
      method: method,
      url: url,
      baseURL: FacebookAdsApi.GRAPH,
      json: !useMultipartFormData,
      headers: {
        "User-Agent": "fbbizsdk-nodejs-v" + FacebookAdsApi.SDK_VERSION,
      },
      data: method === "GET" ? undefined : data,
      resolveWithFullResponse: showHeader,
    };

    if (useMultipartFormData || (files && Object.keys(files).length > 0)) {
      console.log("here coming");

      // Create a new FormData object
      const formData = new FormData();

      // Append all the data fields to FormData
      if (data) {
        Object.keys(data).forEach((key) => {
          formData.append(key, data[key]);
        });
      }

      // Append all the files to FormData
      if (files) {
        Object.keys(files).forEach((key) => {
          formData.append(key, files[key]); // `files[key]` should be a `Blob` or `File` object
        });
      }

      // Update Axios options to use FormData
      options.data = formData;

      // Ensure the correct headers for FormData
      options.headers = {
        ...options.headers,
        "Content-Type": "multipart/form-data",
      };
    }

    return axios(options).catch((response: Object) => {
      throw response;
    });
  }
}
