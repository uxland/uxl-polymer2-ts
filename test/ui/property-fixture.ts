import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {computed, customElement, property} from "../../src/index";
import {LitElement, html as litHtml} from "@polymer/lit-element";
const should = chai.should();
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
suite('property fixture', () =>{

    test('property created', () =>{
        let componentName = getDefaultComponentName();
        @customElement(componentName)
        class Component extends PolymerElement{
            @property()
            myProperty: string;
        }
        should.exist(Component['properties']['myProperty']);
        should.equal(Component['properties']['myProperty'].type, String);
    });
    test('computed default value', () =>{
        let componentName = getDefaultComponentName();
        @customElement(componentName)
        class Component extends PolymerElement{
            static get template() {
                return html `<h1 id="header">hello</h1>`;
            }
            //myDefValue: boolean;
            @property()
            myProperty: string;
            @computed('myProperty', undefined, Boolean, false)
            get myDefValue(): Boolean{
                return this.myProperty == 'hello';
            }
            connectedCallback(){
                super.connectedCallback();
            }
        }
        let component = addComponentToFixture<Component>(componentName)
        should.equal(component.myDefValue, false);
        component.myProperty = 'hello';
        should.equal(component.myDefValue, true);
    });
});

suite('property fixture lit element', () =>{

    test('property created', () =>{
        let componentName = getDefaultComponentName();
        @customElement(componentName)
        class Component extends LitElement{
            @property()
            myProperty: string;
        }
        should.exist(Component['properties']['myProperty']);
        should.equal(Component['properties']['myProperty'].type, String);
    });

});