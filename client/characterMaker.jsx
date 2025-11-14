const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

const handleCharacter = (e, onCharacterAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;
    const faceList = e.target.querySelector('#characterFace');
    // best way to copy what picrew does is have a ul
    // and check which of the li has the class "selected"
    // TODO: add rest of lists and set up querying to find which
    // was selected.
    // Then make new HTML for this

    if(!name || !age) {
        helper.handleError('All fields are required');
        return false;
    }


    // Set the face to either the cute face or the regular face
    
    let face;
    // If true, cute was selected
    if (faceBool) {
        face = './assets/img/face.png';
    } else { // Otherwise set to default face
        face = '/assets/img/domoface.jpeg';
    }

    helper.sendPost(e.target.action, {name, age, face}, onDomoAdded);
    return false;
}

const DomoForm = (props) => {
    return (
        <form id="domoForm"
            onSubmit={(e) => handleDomo(e, props.triggerReload)}
            name="domoForm"
            action="/maker"
            method="POST"
            className="domoForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="domoName" type="text" name="name" placeholder="Domo Name" />
            <label htmlFor="age">Age: </label>
            <input id="domoAge" type="number" min="0" name="age" />
            <label htmlFor="face">Cute: </label>
            <input id="domoFace" type="checkbox" name="face" />
            <input className="makeDomoSubmit" type="submit" value="Make Domo" />
        </form>
    );
};

const DomoList = (props) => {
    const [domos, setDomos] = useState(props.domos);

    useEffect(() => {
        const loadDomosFromServer = async () => {
            const response = await fetch('/getDomos');
            const data = await response.json();
            setDomos(data.domos);
        };
        loadDomosFromServer();
    }, [props.reloadDomos]);

    if(domos.length === 0) {
        return (
            <div className="domoList">
                <h3 className="emptyDomo">No Domos Yet!</h3>
            </div>
        );
    }

    const domoNodes = domos.map(domo => {
        return (
            <div key={domo.id} className="domo">
                <img src={domo.face} alt="domo face" className="domoFace" />
                <h3 className="domoName">Name: {domo.name}</h3>
                <h3 className="domoAge">Age: {domo.age}</h3>
            </div>
        );
    });

    return (
        <div className="domoList">
            {domoNodes}
        </div>
    );
};

const App = () => {
    const [reloadDomos, setReloadDomos] = useState(false);

    return (
        <div>
            <div id="makeDomo">
                <DomoForm triggerReload={() => setReloadDomos(!reloadDomos)} />
            </div>
            <div id="domos">
                <DomoList domos={[]} reloadDomos={reloadDomos} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;