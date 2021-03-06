import {customElement, listen} from "../../src";
import * as sinon from 'sinon';
import {LitElement, html as litHtml} from "@polymer/lit-element";
const assert = chai.assert;
const fixtureElementName = 'polymer-decorators-fixture';
const defaultComponentName = 'custom-element';
const getComponentName = (nameBase: string) => {
    let counter = 0;
    return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);
const addComponentToFixture = <T>(componentName: string) => {
    const container: HTMLDivElement = fixture(fixtureElementName);
    const component: T = <any>document.createElement(componentName);
    container.appendChild(<any>component);
    return component;
};

describe('when applying `listener` decorator in a Lit Element', () =>{
    describe('and the target is an object', () =>{
        it('should invoke target method when the object dispatches the event', async() =>{
            const componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends LitElement{
                render() {
                    return litHtml `<h1 id="header">hello</h1>`;
                }
                @listen('scroll', document)
                onDocumentScrolled(){
                }
            }
            let component: Component = <Component>addComponentToFixture(componentName);
            await component.updateComplete;
            let spy = sinon.spy(component, 'onDocumentScrolled');
            document.dispatchEvent(new CustomEvent('scroll', {bubbles: false}));
            assert.isTrue(spy.calledOnce);
        });
    });
    describe('and the target is a selector', () =>{
        it('should subscribe to all child with class selector if selector is a class',async() =>{
            const componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends LitElement{
                render() {
                    return litHtml `<div><button class="btn">Button1</button> <button class="btn">Button 2</button> <button>Button3</button></div>`;
                }
                @listen('click', '.btn')
                onEvent(){
                }
            }
            let component: Component = <Component>addComponentToFixture(componentName);
            await component.updateComplete;
            let spy = sinon.spy(component, 'onEvent');
            let btns: NodeListOf<HTMLButtonElement> = component.shadowRoot.querySelectorAll('button');
            btns.forEach(btn => btn.click());
            assert.isTrue(spy.calledTwice);
        });
        it('should subscribe to all child with of type if selector is tag',async() =>{
            const componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends LitElement{
                render() {
                    return litHtml `<div><my-component class="btn">Button1</my-component> <my-component class="btn">Button 2</my-component> <my-component>Button3</my-component></div>`;
                }
                @listen('click', 'my-component')
                onEvent(){
                }
            }
            let component: Component = <Component>addComponentToFixture(componentName);
            await component.updateComplete;
            let spy = sinon.spy(component, 'onEvent');
            let btns: NodeListOf<HTMLButtonElement> = component.shadowRoot.querySelectorAll('my-component');
            btns.forEach(btn => btn.click());
            assert.isTrue(spy.calledThrice);
        });
        it('should subscribe to one child with id if selector is an id',async() =>{
            const componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends LitElement{
                render() {
                    return litHtml `<div><my-component id="c1" class="btn">Button1</my-component> <my-component class="btn">Button 2</my-component> <my-component>Button3</my-component></div>`;
                }
                @listen('click', '#c1')
                onEvent(){
                }
            }
            let component: Component = <Component>addComponentToFixture(componentName);
            await component.updateComplete;
            let spy = sinon.spy(component, 'onEvent');
            let btns: NodeListOf<HTMLButtonElement> = component.shadowRoot.querySelectorAll('my-component');
            btns.forEach(btn => btn.click());
            assert.isTrue(spy.calledOnce);
        });
    });

});