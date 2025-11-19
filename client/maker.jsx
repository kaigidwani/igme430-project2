const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// TODO:
    // - test that this works
    //    - Resolve error with length property of characterList
    // - Replace list items with real assets
    // - Figure out CSS for the items to display them

const handleCharacter = (e, onCharacterAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;
    const faceList = e.target.querySelector('#characterFace').querySelector("#selected");
    const skinColorList = e.target.querySelector('#characterSkinColor').querySelector("#selected");
    const hairList = e.target.querySelector('#characterHair').querySelector("#selected");
    const topList = e.target.querySelector('#characterTop').querySelector("#selected");
    const bottomsList = e.target.querySelector('#characterBottoms').querySelector("#selected");
    // best way to copy what picrew does is have a ul
    // and check which of the li has the class "selected"

    if(!name) {
        helper.handleError('Name is required');
        return false;
    }

    // Get selected items from each list
    const face = faceList.getAttribute("data");
    console.log("Face: " + face);

    const skinColor = skinColorList.getAttribute("data");
    console.log("Skin color: " + skinColor);

    const hair = hairList.getAttribute("data");
    console.log("Hair: " + hair);

    const top = topList.getAttribute("data");
    console.log("Top: " + top);

    const bottoms = bottomsList.getAttribute("data");
    console.log("Bottoms: " + bottoms);

    helper.sendPost(e.target.action, {name, face, skinColor, hair, top, bottoms}, onCharacterAdded);
    return false;
}

const CharacterForm = (props) => {
    return (
        <form id="characterForm"
            onSubmit={(e) => handleCharacter(e, props.triggerReload)}
            name="characterForm"
            action="/maker"
            method="POST"
            className="characterForm"
        >
            <label htmlFor="name">Name: </label>
            <input id="characterName" type="text" name="name" placeholder="Character Name" />
            <ul id="characterSkinColor" name="skinColor">Skin Color:
                <li id="selected" data="./assets/img/face.png">
                    <img src="./assets/img/face.png"/>
                </li>
                <li id="" data="./assets/img/domoface.jpeg">
                    <img src="./assets/img/domoface.jpeg"/>
                </li>
            </ul>
            <ul id="characterFace" name="face">Face:
                <li id="selected" data="./assets/img/face.png">
                    <img src="./assets/img/face.png"/>
                </li>
                <li id="" data="./assets/img/domoface.jpeg">
                    <img src="./assets/img/domoface.jpeg"/>
                </li>
            </ul>
            <ul id="characterHair" name="hair">Hair:
                <li id="selected" data="./assets/img/face.png">
                    <img src="./assets/img/face.png"/>
                </li>
                <li id="" data="./assets/img/domoface.jpeg">
                    <img src="./assets/img/domoface.jpeg"/>
                </li>
            </ul>
            <ul id="characterTop" name="top">Top:
                <li id="selected" data="./assets/img/face.png">
                    <img src="./assets/img/face.png"/>
                </li>
                <li id="" data="./assets/img/domoface.jpeg">
                    <img src="./assets/img/domoface.jpeg"/>
                </li>
            </ul>
            <ul id="characterBottoms" name="bottoms">Bottoms:
                <li id="selected" data="./assets/img/face.png">
                    <img src="./assets/img/face.png"/>
                </li>
                <li id="" data="./assets/img/domoface.jpeg">
                    <img src="./assets/img/domoface.jpeg"/>
                </li>
            </ul>
            <input className="makeCharacterSubmit" type="submit" value="Make Character" />
        </form>
    );
};

const CharacterList = (props) => {
    const [characters, setCharacters] = useState(props.characters);

    useEffect(() => {
        const loadCharactersFromServer = async () => {
            const response = await fetch('/getCharacters');
            const data = await response.json();
            setCharacters(data.characters);
        };
        loadCharactersFromServer();
    }, [props.reloadCharacters]);

    if(characters.length === 0) {
        return (
            <div className="characterList">
                <h3 className="emptyCharacter">No Characters Yet!</h3>
            </div>
        );
    }

    const characterNodes = characters.map(character => {
        return (
            <div key={character.id} className="character">
                <h3 className="characterName">Name: {character.name}</h3>
                <img src={character.skinColor} alt="character skin" className="characterSkinColor" />
                <img src={character.face} alt="character face" className="characterFace" />
                <img src={character.hair} alt="character hair" className="characterHair" />
                <img src={character.top} alt="character top" className="characterTop" />
                <img src={character.bottoms} alt="character bottoms" className="characterBottoms" />
            </div>
        );
    });

    return (
        <div className="characterList">
            {characterNodes}
        </div>
    );
};

const App = () => {
    const [reloadCharacters, setReloadCharacters] = useState(false);

    return (
        <div>
            <div id="makeCharacter">
                <CharacterForm triggerReload={() => setReloadCharacters(!reloadCharacters)} />
            </div>
            <div id="characters">
                <CharacterList characters={[]} reloadCharacters={reloadCharacters} />
            </div>
        </div>
    );
};

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;