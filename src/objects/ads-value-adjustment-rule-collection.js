 /*
 * Copyright (c) Meta Platforms, Inc. and affiliates.
 * All rights reserved.
 *
 * This source code is licensed under the license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 */

import {AbstractCrudObject} from './../abstract-crud-object';
import AbstractObject from './../abstract-object';
import Cursor from './../cursor';

/**
 * AdsValueAdjustmentRuleCollection
 * @extends AbstractCrudObject
 * @see {@link https://developers.facebook.com/docs/marketing-api/}
 */
export default class AdsValueAdjustmentRuleCollection extends AbstractCrudObject {
  static get Fields (): Object {
    return Object.freeze({
      id: 'id',
      name: 'name',
    });
  }


  getPersonas (fields: Array<string>, params: Object = {}, fetchFirstPage: boolean = true): Cursor | Promise<*> {
    return this.getEdge(
      AbstractObject,
      fields,
      params,
      fetchFirstPage,
      '/personas'
    );
  }

  
  get (fields: Array<string>, params: Object = {}): AdsValueAdjustmentRuleCollection {
    // $FlowFixMe : Support Generic Types
    return this.read(
      fields,
      params
    );
  }
}
