import {PolymerElement} from "@polymer/polymer/polymer-element";
import {customElement, listen, observe, property} from "../../src";
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
describe('when applying `observe` decorator to a Polymer Element', () =>{
    it('should invoke observe handler whenever property changes', function () {
        let componentName = getDefaultComponentName();
        @customElement(componentName)
        class Component extends PolymerElement{
            @property()
            myProperty: string;
            @observe('myProperty')
            myPropertyChanged(myProperty: string){

            }
        }
        let component = addComponentToFixture<Component>(componentName);
        let spy = sinon.spy(component, 'myPropertyChanged');
        component.notifyPath('myProperty', 'hello');
        assert.isTrue(spy.calledOnceWith('hello'));
    });
    describe('and observe several properties', () =>{
        it('should invoke handler whenever any of the property changes', () =>{
            let componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends PolymerElement{
                @property()
                myProperty1: string;
                @property()
                myProperty2: string;
                @property()
                myProperty3: string;
                @property()
                myProperty4: string;
                @observe('myProperty1', 'myProperty2', 'myProperty3', )
                myPropertyChanged(myProperty: string){

                }
            }
            let component = addComponentToFixture<Component>(componentName);
            let spy = sinon.spy(component, 'myPropertyChanged');
            component.notifyPath('myProperty1', 'hello1');
            component.notifyPath('myProperty2', 'hello2');
            component.notifyPath('myProperty3', 'hello3');
            component.notifyPath('myProperty4', 'hello');
            assert.isTrue(spy.calledWith('hello1', undefined, undefined));
            assert.isTrue(spy.calledWith('hello1', 'hello2', undefined));
            assert.isTrue(spy.calledWith('hello1', 'hello2', 'hello3'));
            assert.equal(spy.callCount, 3);
        });
        it('observe subproperty', () =>{
            let componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends PolymerElement{
                @property()
                myProperty1: string;
                @property()
                myProperty2: string;
                @property()
                myProperty3: string;
                @property()
                myProperty4: string;
                @property()
                myProperty5: Object;

                @observe('myProperty1', 'myProperty2', 'myProperty3', 'myProperty5.p1')
                myPropertyChanged(){

                }
            }
            let component = addComponentToFixture<Component>(componentName);
            let spy = sinon.spy(component, 'myPropertyChanged');
            component.notifyPath('myProperty1', 'hello1');
            component.notifyPath('myProperty2', 'hello2');
            component.notifyPath('myProperty3', 'hello3');
            component.notifyPath('myProperty4', 'hello4');
            component.notifyPath('myProperty5.p1', 'hello5');
            assert.isTrue(spy.calledWith('hello1', undefined, undefined, undefined));
            assert.isTrue(spy.calledWith('hello1', 'hello2', undefined, undefined));
            assert.isTrue(spy.calledWith('hello1', 'hello2', 'hello3', undefined));
            assert.isTrue(spy.calledWith('hello1', 'hello2', 'hello3', 'hello5'));
            assert.equal(spy.callCount, 4);
        });
        it('observe subproperties with wild card', () =>{
            let componentName = getDefaultComponentName();
            @customElement(componentName)
            class Component extends PolymerElement{
                @property()
                myProperty1: string;
                @property()
                myProperty2: string;
                @property()
                myProperty3: string;
                @property()
                myProperty4: string;
                @property()
                myProperty5: Object;

                @observe('myProperty1', 'myProperty2', 'myProperty3', 'myProperty5.*')
                myPropertyChanged(){

                }
            }
            let component = addComponentToFixture<Component>(componentName);
            let spy = sinon.spy(component, 'myPropertyChanged');
            component.notifyPath('myProperty1', 'hello1');
            component.notifyPath('myProperty2', 'hello2');
            component.notifyPath('myProperty3', 'hello3');
            component.notifyPath('myProperty4', 'hello4');
            component.notifyPath('myProperty5.p1', 'hello5');
            component.notifyPath('myProperty5.p2', 'hello6');

            assert.equal(spy.callCount, 5);
        })
    });
});
