import { useState } from 'react';

//Crear un objeto
const car = {
    modelo: "Corola",
    año: 2009
};

const app = document.getElementById('app');

function createTitle(title) {
    return title ? title : 'Default title';
}

function Header({ title }) {
    return <h1>{createTitle(title)}</h1>;
}


function HomePage() {

    const [likes, setLikes] = React.useState(0);
    const names = ['Ada Lovelace', 'Grace Hopper', 'Margaret Hamilton'];

    function handleClick() {
        setLikes(likes + 1);
    }

    return (
        <div>
            <Header title="Develop. Preview. Ship." />
            <ul>
                {names.map((name) => (<li key={name} >{name}</li>))}
            </ul>
            <button onClick={handleClick}> Like({likes})</button>

        </div>
    );
}

const root = ReactDOM.createRoot(app);
root.render(<HomePage />);