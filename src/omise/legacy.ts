/**
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 * Support legacy
 * -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=
 */

import { Client } from "./client";


interface LegacyConfiguration {
  amount:           number,
  publicKey:        string,
  currency:         string,
  logo:             string,
  frameLabel:       string,
  submitLabel:      string,
  buttonLabel:      string,
  locationField:    string,
  submitFormTarget: string,
  submitAuto:       string
}


export class Card {

  private trackId:              string;
  private omiseScriptTag:       HTMLElement;
  private payForm:              HTMLFormElement;
  private defaultConfig:        Object;
  private targetButtonConfig:   Array<any>;
  private Omise:                Client;


  constructor(Omise: Client) {
    this.Omise = Omise;

    this.defaultConfig = {};
    this.targetButtonConfig = [];
  }


  /**
   * Initialize
   */
  public init() {
    if (this.isInMerchantView()) {

      var _self = this;

      if (document.body) {
        this.injectIframeWhenFoundScript();
      }
      // if don't found body, need to wait DOM is ready.
      else {
        document.addEventListener('DOMContentLoaded', function(e) {
          _self.injectIframeWhenFoundScript();
        });
      }
    }
  }


  /**
   * [Legacy] Set default configure to cardjs
   *
   * @param {object} config - configure for cardjs.
   *
   * @return {object} default configure
   */
  public configure(config: LegacyConfiguration) {
    this.defaultConfig = assign({}, this.fixLagecyConfig(config));
    return this.defaultConfig;
  }


  /**
   * [Legacy] Set configure to pay button
   *
   * @param {string} id     - button target id.
   * @param {object} config - configure for pay button.
   *
   * @return {object} new button configure
   */
  public configureButton(buttonId: string, config: LegacyConfiguration) {
    const newButtonConfig = {
      buttonId: buttonId,
      configuration: assign({}, this.defaultConfig, config)
    };

    this.targetButtonConfig.push(newButtonConfig);

    return newButtonConfig;
  }


  /**
   * [Legacy] Active configure.
   */
  public attach() {
    const _self = this;
    const allButtons = <any>[];

    this.targetButtonConfig.forEach(function(item) {
      let formNode: any;
      const payButton = document.querySelector(item.buttonId);

      if ( ! isEmpty(item.configuration.formTarget)) {
        formNode = _self.getFormBySelector(item.configuration.formTarget);
      }
      else {
        formNode = _self.getFormByTarget(payButton);
      }

      for (const name in item.configuration) {
        const keyName = 'data-' + camelCaseToDash(name);
        const keyValue = item.configuration[name];

        if ( ! isEmpty(keyValue)) {
          payButton.setAttribute(keyName, keyValue);
        }
      }

      _self.Omise.createButton(payButton, formNode);
      allButtons.push(payButton);
    });

    // inject iframe
    this.injectCardIframe(allButtons);
  }


  /**
   * Inject iframe to merchant page.
   *
   * @param {Array} all buttons.
   */
  public injectCardIframe(allButtons: Array<any>) {
    const iframeApp = document.getElementById('omise-inject-iframe-app');
    if (!iframeApp) {
      const cardFrame = this.Omise.createCardFrame();

      // disable all button before iframe was finished loaded.
      allButtons.forEach(function(button) {
        button.setAttribute('disabled', 'disabled');
      });

      // wait for iframe loaded and remove disable from button
      cardFrame.frame.onload = function() {
        allButtons.forEach(function(button) {
          button.removeAttribute('disabled');
        });
      }
    }
  }


  /**
   * Close iframe app
   */
  public close() {
    this.Omise.getCardFrame().close();
  }

  /**
   * Get iframe app id.
   *
   * @return {string} iframe app id.
   */
  public getIframeId() {
    return this.Omise.getFrameId();
  }


  /**
   * Remove iframe app in merchant page.
   *
   * @return {HTMLElement} node iframe.
   */
  public removeInjectIframe() {
    return this.Omise.destroyCardFrame();
  }


  /**
   * Generate track id
   *
   * @return {string} track id.
   */
  private generateTrackId() {
    this.trackId = 'omise-script-tag-' + new Date().getTime();
    return this.trackId;
  }


  /**
   * Find omise script tag and add track id for help to access later.
   *
   * @return {HTMLElement} omise script tag element.
   */
  private getOmiseScriptTag() {
    if ( !this.omiseScriptTag ) {
      let omiseScriptTag: any;
      const scriptElements = document.getElementsByTagName('script');

      for (let i = 0, len = scriptElements.length; i < len; i++) {
        const el = scriptElements[i];

        if (el.getAttribute('data-key') && el.getAttribute('data-amount')) {
          el.id = this.generateTrackId();
          omiseScriptTag = el;
          break;
        }
      }

      this.omiseScriptTag = omiseScriptTag;
    }

    return this.omiseScriptTag;
  }


  /**
   * Get form element by target.
   *
   * @return {HTMLFormElement} pay form element.
   */
  private getFormByTarget(target?: HTMLElement) {
    if ( ! this.payForm) {
      let currentNode = target || this.getOmiseScriptTag();

      // travel DOM until found form tag
      while (currentNode && currentNode.tagName !== 'FORM') {
        currentNode = <HTMLFormElement>currentNode.parentNode;
      }

      this.payForm = <HTMLFormElement>currentNode;
    }

    return this.payForm;
  }


  /**
   * Get form element by selector
   *
   * @return {HTMLFormElement} pay form element.
   */
  private getFormBySelector(selector: string) {
    return document.querySelector(selector);
  };

  /**
   * Create pay button and transfer data from omise script tag to button
   *
   * @return {Node} pay button element.
   */
  private createPayButtonFromScriptTag() {
    const omiseScriptTag = this.getOmiseScriptTag();
    const data = this.extractDataFromElement(omiseScriptTag);

    const payButton = document.createElement('button');

    // add data attribute to button
    for (const name in data) {
      payButton.setAttribute(name, data[name]);
    }

    return payButton;
  }


  /**
   * Assume if we found `omise script tag` it mean we are in merchant view.
   *
   * @return {boolean} is in merchant view or not.
   */
  private isInMerchantView() {
    return document.getElementById('Omise__CardJs__Iframe__App') ? false : true;
  }


  /**
   * Automatic inject iframe in merchant view with auto generate pay button
   * when found omise script tag
   */
  private injectIframeWhenFoundScript() {
    // if found omise script, then auto add pay button.
    if (this.getOmiseScriptTag()) {
      const injectButton = this.injectPayButtonToForm();
      this.injectCardIframe([injectButton]);
    }
  }


  /**
   * Inject pay button to from.
   *
   * @return {HTMLElement} inject button element.
   */
  private injectPayButtonToForm() {
    const formNode = this.getFormByTarget();
    const button = this.createPayButtonFromScriptTag();

    if (formNode) {
      formNode.appendChild(button);
      this.Omise.createButton(button, formNode);
      return button;
    }
    else {
      throw new Error('Missing from element for omise script tag');
    }
  }


  /**
   * Merge and fix lagacy config name to new version name.
   *
   * @param {object} lagacyConfig - Legacy config.
   *
   * @return {object} fix config.
   */
  private fixLagecyConfig(lagacyConfig: LegacyConfiguration) {
    const fixConfig: any = {};
    const fixKeys = {
      'publicKey':        'key',
      'logo':             'image',
      'locationField':    'location',
      'submitFormTarget': 'formTarget'
    };

    // assign value and fix key
    for (const key in lagacyConfig) {
      // found key that need to fix
      if ((<any>fixKeys)[key]) {
        const correctKeyName = (<any>fixKeys)[key];
        fixConfig[correctKeyName] = (<any>lagacyConfig)[key];
      }
      else {
        fixConfig[key] = (<any>lagacyConfig)[key];
      }
    }

    return fixConfig;
  }


  /**
   * Helper function to extrack all data from element.
   *
   * @param {HTMLElement} element - element for extract data.
   *
   * @return {object} all data and value.
   */
  private extractDataFromElement(element: HTMLElement) {
    const extractData: any = [];
    const totalAttrs = element.attributes.length;

    for (let i = 0; i < totalAttrs; i++) {
      const attr = element.attributes[i];

      // Exteact all only data from element
      if (/^data/.test(attr.name)) {
        extractData[attr.name] = attr.value;
      }
    }

    return extractData;
  }
}


/**
 * Helper for transfrom `camelCase` to `dash`.
 *
 * @param {string} name - name for transform.
 *
 * @param {string} name after transform.
 */
function camelCaseToDash(name: string) {
  return name.replace(/([a-z])([A-Z])/g, '$1-$2');
}

/**
 * Helper for assign object.
 *
 * @param {object} ...sources - sources to assign.
 *
 * @return {object} assignd object.
 */
function assign(target: any, ...sources: any[]) {
  // We must check against these specific cases.
  if (target === undefined || target === null) {
    throw new TypeError('Cannot convert undefined or null to object');
  }

  var output = Object(target);
  for (var index = 1; index < arguments.length; index++) {
    var source = arguments[index];
    if (source !== undefined && source !== null) {
      for (var nextKey in source) {
        if (source.hasOwnProperty(nextKey)) {
          output[nextKey] = source[nextKey];
        }
      }
    }
  }
  return output;
}

/**
 * Helper for check value is empty or not.
 */
function isEmpty(value: any) {
  return (value == null || value === '') ? true : false;
}

/**
 * Helper for clone object.
 *
 * @param {object} target - target object to clone.
 */
function cloneObject(target: Object) {
  return JSON.parse(JSON.stringify(target));
}
