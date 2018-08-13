import {PolymerElement, html} from '@polymer/polymer/polymer-element.js';
import {customElement, property} from "../../src/index";
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