import {customElement, property} from "../../src/index";
import {LitElement} from "@polymer/lit-element";
const should = chai.should();
const fixtureElementName = 'polymer-decorators-fixture';
const defaultComponentName = 'custom-element';
const getComponentName = (nameBase: string) => {
    let counter = 0;
    return () => `${nameBase}${++counter}`;
};
const getDefaultComponentName = getComponentName(defaultComponentName);

suite('property fixture', () =>{

    test('property created', () =>{
        let componentName = getDefaultComponentName();
        @customElement(componentName)
        class Component extends LitElement{
            @property()
            myProperty: string;
            render(){
                return null;
            }
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
            render(){
                return null;
            }
        }
        should.exist(Component['properties']['myProperty']);
        should.equal(Component['properties']['myProperty'].type, String);
    });

});