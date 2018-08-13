import 'reflect-metadata/Reflect';
import {LitElement} from "@polymer/lit-element";
import EventEmitter = NodeJS.EventEmitter;
export type StatePathFunction = (state: object) => any;

export interface PropertyOptions {

    type?: BooleanConstructor|DateConstructor|NumberConstructor|StringConstructor|
        ArrayConstructor|ObjectConstructor;
    notify?: boolean;
    reflectToAttribute?: boolean;
    readOnly?: boolean;
    computed?: string;
    statePath?: string | StatePathFunction;
}
export interface ElementConstructor extends Function {
    is?: string;
    properties?: {[prop: string]: PropertyOptions};
    _addDeclarativeEventListener?:
        (target: string|EventTarget,
         eventName: string,
         handler: (ev: Event) => void) => void;
}

export interface ElementPrototype  {
    constructor: ElementConstructor;
}

const createPolymerProperty = (propConfig: any, proto: any, propName: string) =>{
    const properties =  Object.keys(Object.assign({}, proto.constructor.properties))
        .filter(key => !proto.__proto__.constructor.properties || !proto.__proto__.constructor.properties[key])
        .reduce((previousValue, currentValue) => {return {...previousValue, [currentValue]: proto.constructor.properties[currentValue]}}, {[propName]: propConfig});

    Object.defineProperty(proto.constructor, 'properties', {
        get(){
            return properties;
        },
        enumerable: true,
        configurable: true
    });
};
export function property<T>(options?: PropertyOptions) {
    return (proto: any, propName: string): any => {
        const notify = (options && options.notify) ? true : false;
        const reflect = (options && options.reflectToAttribute) ? true : false;
        const readOnly = (options && options.readOnly) ? true : false;
        const type = (<any>Reflect).getMetadata('design:type', proto, propName);
        let propConfig: any = {type: type};
        if (notify) propConfig.notify = true;
        if (reflect) propConfig.reflectToAttribute = true;
        if (readOnly) propConfig.readOnly = true;
        if(options && options.statePath)
            propConfig.statePath = options.statePath;
        createPolymerProperty(propConfig, proto, propName);
    };
}

export const item = (id: string) => query(`#${id}`);

export function listen(eventName: string, target?: string | EventTarget) {
    return (proto: any, functionKey: any) => {
        addReadyHandler(proto);
        if (proto.__listeners) {
            proto.__listeners.push({ target, functionKey, eventName });
            return;
        }

        proto.__listeners = [{ target, functionKey, eventName }];
    };
}

export function gestureListen(eventName: string, targetElem?: string) {
    return (proto: any, functionKey: any) => {

        addReadyHandler(proto);
        if (proto.__gestureListeners) {
            proto.__gestureListeners.push({ targetElem, functionKey, eventName });
            return;
        }

        proto.__gestureListeners = [{ targetElem, functionKey, eventName }];
    };
}

//IE 11 Support
function getName(func: any) {
    return func.name ? func.name : func.toString().match(/^function\s*([^\s(]+)/)[1];
}
interface EventHandler {
    node: EventTarget;
    handler: (e) => void;
    eventName: string;
}
function addReadyHandler(proto: any) {
    if (proto.__readyHandlerAdded)
        return;

    const connectedCallback = proto.connectedCallback;
    const disconnectCallback = proto.disconnectCallback;
    proto.connectedCallback = async function register(...args: any[]){
        await connectedCallback.apply(this, args);
        let handlers: EventHandler[] = [];
        (proto.__listeners || []).forEach(v =>{
            let nodes:EventTarget[] = [] ;
           if(typeof v.target === 'string'){
               let queryResult: NodeListOf<Node> = this.shadowRoot.querySelectorAll(v.target);
               queryResult.forEach(n => nodes.push(n));
           }
           else nodes.push(v.target);
           nodes.forEach(node => {
               let handler: EventHandler = {eventName: v.eventName, node, handler: ((e) => this[v.functionKey](e)).bind(this)};
               node.addEventListener(v.eventName, handler.handler);
               handlers.push(handler)
           });
        });
        this.__listenersEventHandlers = handlers;
    }
    proto.disconnectCallback = function unregister(...args: any[]){
        disconnectCallback.apply(args, this);
        (this.__listenersEventHandlers as EventHandler[]).forEach(handler => handler.node.removeEventListener(handler.eventName, handler.handler));
        this.__listenersEventHandlers = [];
    }
    proto.__readyHandlerAdded = true;
}







/**
 * A TypeScript class decorator factory that registers the class as a custom
 * element.
 *
 * If `tagname` is provided, it will be used as the custom element name, and
 * will be assigned to the class static `is` property. If `tagname` is omitted,
 * the static `is` property of the class will be used instead. If neither exist,
 * or if both exist but have different values (except in the case that the `is`
 * property is not an own-property of the class), an exception is thrown.
 */

interface Reflect {
    hasMetadata?:
        (metadataKey: string, proto: object, targetKey: string) => boolean;
    getMetadata?: (metadataKey: string, proto: object, targetKey: string) =>
        object | undefined;
}


export const query = _query(
    (target: NodeSelector, selector: string) => target.querySelector(selector));

export const queryAll = _query(
    (target: NodeSelector, selector: string) =>
        target.querySelectorAll(selector));

/**
 * Creates a decorator function that accepts a selector, and replaces a
 * property with a getter than executes the selector with the given queryFn
 *
 * @param queryFn A function that executes a query with a selector
 */
function _query(
    queryFn: (target: NodeSelector, selector: string) =>
        Element | NodeList | null) {
    return (selector: string) => (proto: ElementPrototype, propName: string) => {
        Object.defineProperty(proto, propName, {
            get(this: HTMLElement) {
                return queryFn(this.shadowRoot!, selector);
            },
            enumerable: true,
            configurable: true,
        });
    };
}

export type HasEventListener<P extends string> = {
    [K in P]: (e: Event) => void
};

export function customElement(tagname?: string) {
    return (class_: {new (): any}&ElementConstructor) => {
        if (tagname) {
            // Only check that tag names match when `is` is our own property. It might
            // be inherited from a superclass, in which case it's ok if they're
            // different, and we'll override it with our own property below.
            if (class_.hasOwnProperty('is')) {
                if (tagname !== class_.is) {
                    throw new Error(
                        `custom element tag names do not match: ` +
                        `(${tagname} !== ${class_.is})`);
                }
            } else {
                Object.defineProperty(class_, 'is', {value: tagname});
            }
        }
        // Throws if tag name is missing or invalid.
        window.customElements.define(class_.is!, class_);
    };
}