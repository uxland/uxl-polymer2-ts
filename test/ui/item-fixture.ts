import {customElement, item} from "../../src/index";
import {html, LitElement} from '@polymer/lit-element/lit-element';
const {assert} = chai;
const should = chai.should();

suite('item-fixture', () =>{
    const fixtureElementName = 'polymer-decorators-fixture';
    test('create item', async() =>{
        @customElement('custom-element')
        class Component extends LitElement {
            render(){
                return html `<h1 id="header">MyComponent</h1>`;
            }
            @item('header')
            h1: HTMLHeadElement;
        }
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement('custom-element');
        container.appendChild(<any>component);
        await component.updateComplete;
        should.exist(component.h1);
        assert.equal(component.h1.innerText, 'MyComponent');
    });
    test('lit element', async() =>{
        @customElement('custom-lit-element')
        class Component extends LitElement{
            render(){
                return html `<span id="my-span">Hello world</span>`
            }
            @item('my-span')
            mySpan: HTMLSpanElement;
        }
        let container: HTMLDivElement = fixture(fixtureElementName);
        let component: Component = <any>document.createElement('custom-lit-element');
        container.appendChild(<any>component);
        component.requestUpdate();
        await component.updateComplete;
        should.exist(component.mySpan);
        assert.equal(component.mySpan.constructor, HTMLSpanElement);
    });
});