import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from '../UserContext';

const CreateRoom = (props) => {
  const [boosters, setBoosters] = useState(props.boosters);
  const [chosenBoosters, setChosenBoosters] = useState([]);
  const [gamemode, setGamemode] = useState('gamemode 1');
  const [roomname, setRoomname] = useState('');
  const { username, setCurrentRoomName, currentRoomOwner, setRoomOwner } = useContext(UserContext);

  const handleCheckbox = (booster) => {
    if (chosenBoosters.includes(booster)) {
      const updatedBoosters = chosenBoosters.filter(item => item !== booster);
      setChosenBoosters(updatedBoosters);
    } else {
      const updatedBoosters = [...chosenBoosters, booster];
      setChosenBoosters(updatedBoosters);
    }

    console.log('chosenBoosters', chosenBoosters);
  };

  const createRoom = () => {
    console.log('createRoom', roomname, gamemode, chosenBoosters, username);
    fetch('http://localhost:3001/newRoom', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        roomname,
        gamemode,
        chosenBoosters,
        players: [{username : username, lastAwnser: '', hasAwsered: false}],
        roomOwner: username,
        gamePhase: 'lobby',
        cards: [],
        cardAwnser: undefined,
        cardSamples: [],
      })
    })
      .then(response => response.json())
      .then(data => {
        // Update currentRoomName in context
        setCurrentRoomName(roomname);
        setRoomOwner(username);
        // Handle the response data
      })
      .catch(error => {
        // Handle the error
      });
  };

  return (
    <div>
      <h1>Lets Create a room!</h1>
      <div style={{ overflowY: 'scroll', height: '200px', width: '400px', float: 'left' }}>
        <ul>
          {boosters.map((booster, index) => (
            <li key={index}>
              <input type="checkbox" onClick={() => handleCheckbox(booster)} />
              {booster}
            </li>
          ))}
        </ul>
      </div>

      <div style={{ height: '200px', width: '400px', float: 'left' }}>
        <ul>
          <li key={0}>
            <input type="checkbox" onClick={() => setGamemode("gamemode 1")} checked={gamemode === "gamemode 1"} />
            {"gamemode 1"}
          </li>
          <li key={1}>
            <input type="checkbox" onClick={() => setGamemode("gamemode 2")} checked={gamemode === "gamemode 2"} />
            {"gamemode 2"}
          </li>
          <li key={2}>
            <input type="checkbox" onClick={() => setGamemode("gamemode 3")} checked={gamemode === "gamemode 3"} />
            {"gamemode 3"}
          </li>
        </ul>
      </div>

      <div style={{ clear: 'both' }}>
        <input type="text" value={roomname} onChange={(e) => setRoomname(e.target.value)} placeholder="enter roomname here" />
      </div>

      <Link to="/GuessTheEffect">
        <button onClick={createRoom}>Create Room</button>
      </Link>
    </div>
  );
};

export default CreateRoom;