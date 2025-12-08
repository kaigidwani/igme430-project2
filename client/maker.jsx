const helper = require('./helper.js');
const React = require('react');
const { useState, useEffect } = React;
const { createRoot } = require('react-dom/client');

// TODO:
    // - Replace list items with real assets
    // - Figure out CSS for the items to display them

const handleCharacter = (e, onCharacterAdded) => {
    e.preventDefault();
    helper.hideError();

    const name = e.target.querySelector('#characterName').value;
    
    const faceList = e.target.querySelector('#characterFace')
    const skinColorList = e.target.querySelector('#characterSkinColor').querySelector("#selected");
    const hairList = e.target.querySelector('#characterHair').querySelector("#selected");
    const topList = e.target.querySelector('#characterTop').querySelector("#selected");
    const bottomsList = e.target.querySelector('#characterBottoms').querySelector("#selected");
    
    const selectedFace = faceList.querySelector("#selected");
    const selectedSkinColor = skinColorList.querySelector("#selected");
    const selectedhHair = hairList.querySelector("#selected");
    const selectedTop = topList.querySelector("#selected");
    const selectedBottoms = bottomsList.querySelector("#selected");

    // best way to copy what picrew does is have a ul
    // and check which of the li has the class "selected"

    if(!name) {
        helper.handleError('Name is required');
        return false;
    }

    // Get selected items from each list
    const face = selectedFace.getAttribute("data");
    console.log("Face: " + face);

    const skinColor = selectedSkinColor.getAttribute("data");
    console.log("Skin color: " + skinColor);

    const hair = selectedhHair.getAttribute("data");
    console.log("Hair: " + hair);

    const top = selectedTop.getAttribute("data");
    console.log("Top: " + top);

    const bottoms = selectedBottoms.getAttribute("data");
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
            <Selection name="skinColor"/>
            <Selection name="face"/>
            <Selection name="hair"/>
            <Selection name="top"/>
            <Selection name="bottoms"/>
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

const getOptions = (name) => {
    let options = {};

    switch (name){
        case 'face':
            options.faceOne = "assets/img/characterOptions/fc_1.png";
            options.faceTwo = "assets/img/characterOptions/fc_2.png";
            break;
        case 'skinColor':
            options.skinColorOne = "assets/img/characterOptions/sc_1.png";
            options.skinColorTwo = "assets/img/characterOptions/sc_2.png";
            options.skinColorThree = "assets/img/characterOptions/sc_3.png";
            options.skinColorFour = "assets/img/characterOptions/sc_4.png";
            options.skinColorFive = "assets/img/characterOptions/sc_5.png";
            options.skinColorSix = "assets/img/characterOptions/sc_6.png";
            options.skinColorSeven = "assets/img/characterOptions/sc_7.png";
            options.skinColorEight = "assets/img/characterOptions/sc_8.png";
            options.skinColorNine = "assets/img/characterOptions/sc_9.png";
            options.skinColorTen = "assets/img/characterOptions/sc_10.png";
            break;
        case 'hair':
            options.hairOne = "assets/img/characterOptions/hr_1.png";
            options.hairTwo = "assets/img/characterOptions/hr_2.png";
            break;
        case 'top':
            options.topOne = "assets/img/characterOptions/tp_1.png";
            options.topTwo = "assets/img/characterOptions/tp_2.png";
            break;
        case 'bottoms':
            options.bottomsOne = "assets/img/characterOptions/bt_1.png";
            options.BottomsTwo = "assets/img/characterOptions/bt_2.png";
            break;
        default:
            console.log("options were not retrieved correctly for name: " + name);
    }

    //console.log("Options recieved succesfully.")
    return options;
}

const Selection = (props) => {
    // Get the options
    const options = getOptions(props.name);

    // Set default selected option to the first one
    const [selectedOption, selectOption] = useState(0);

    //let optionsHTML = "";
    
    //const optionsLength = Object.keys(options).length;

    // Create html for options
    /* for (let i = 0; i < optionsLength; i++) {
        optionsHTML +=
            <li id="" data={options[i]}>
                <img src={options[i]}/>
            </li>;
    } */
    // Replace above with a map function 
    // Look up func to give an object and return vals as an array
    // Run a map func on that to generate the li per item
    // Look at domolist in domomaker


    const optionsHTML = Object.values(options).map((option, i)  => {
        const className = (i == selectedOption) ? "selected" : "";

        return (
            <li id="" data={option} class={className} onClick={
                () => {
                    selectOption(i);
                }
            }>
                <img src={option}/>
            </li>
        );
        
    });

    // Add in below func to the on click above in the li
    // Use i to have the index of the current element and check if it is the selected index saved in this func
    // Use this syntax for var of which index is selected:
    //   const [reloadCharacters, setReloadCharacters] = useState(false);


    // for (let i = 0; i < options.length; i++) {
    //     // Add event listener for click and add class, and remove others
    //     options[i].addEventListener("click", () => {
    //         // Remove selected from all other options
    //         for (let j = 0; j < options.length; j++) {
    //             options[j].classList.remove("selected");
    //         };

    //         // Add the selected class
    //         options[i].classList.add("selected");
    //     });
    // }

    console.log(options);
    console.log(Object.values(options));
    console.log(optionsHTML);

    // Create variables for the different types of variables we need from props.name
    const uppercaseName = Capitalize(props.name);
    const HTMLId = `character${uppercaseName}`;

    // Create the list HTML using the props.name
    let selectionListHTML =
        <ul id={HTMLId} name={props.name}>{uppercaseName}:
            {optionsHTML}
        </ul>;

    // Return finished HTML
    return selectionListHTML;
}

// Uppercase first letter found from StackOverflow here:
// https://stackoverflow.com/questions/1026069/how-do-i-make-the-first-letter-of-a-string-uppercase-in-javascript
const Capitalize = (word) => {
    return word.charAt(0).toUpperCase() + word.slice(1);
}

const init = () => {
    const root = createRoot(document.getElementById('app'));
    root.render( <App /> );
};

window.onload = init;