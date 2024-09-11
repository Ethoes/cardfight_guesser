import React, { useState, useEffect, useContext } from 'react';
import { Link } from 'react-router-dom';
import { UserContext } from './UserContext';
import './Home.css';

const Home = () => {
  const [rooms, setRooms] = useState([]);
  const [tempUsername, setTempUsername] = useState('');
  const { username, setUsername, setCurrentRoomName, setRoomOwner } = useContext(UserContext);

  useEffect(() => {
    fetchRooms();
    const interval = setInterval(fetchRooms, 10000); // Fetch rooms every 10 seconds

    return () => clearInterval(interval); // Clear the interval when the component unmounts
  }, []);

  const fetchRooms = () => {
    fetch('http://178.84.208.93:3001/rooms')
      .then(response => response.json())
      .then(data => {
        if (Array.isArray(data?.rooms)) {
          setRooms(data.rooms);
          console.log(data.rooms);
        } else {
          console.error("rooms is not an array:", data);
        }
      })
      .catch(error => {
        console.error(error);
      });
  };

  const handleUsernameChange = (e) => {
    setTempUsername(e.target.value);
  };

  const handleSubmit = () => {
    setUsername(tempUsername);
  };

  const goToRoom = (roomname, roomOwner) => {
    setCurrentRoomName(roomname);
    setRoomOwner(roomOwner);
    
    fetch('http://178.84.208.93:3001/addPlayer', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            room: roomname,
            player: {username : username, lastAwnser: '', hasAwsered: false}
        })
    })
        .then(response => response.json())
        .then(data => {
            // Handle the response data
        })
        .catch(error => {
            console.error(error);
        });
  };

  return (
    <div className="App">
      <h1>Welcome Home!</h1>
      <Link to="/CreateRoom">
        <button>Create a room</button>
      </Link>
      <input
        type="text"
        placeholder={username !== '' ? username : "Create username"}
        value={tempUsername}
        disabled={username !== ''}
        onChange={handleUsernameChange}
      />
      <button onClick={handleSubmit} disabled={username !== ''}>Submit</button>
      <div>
        <h2>Available Rooms</h2>
        <table>
          <thead>
            <tr>
              <th>Room Name</th>
              <th>Game Mode</th>
              <th>players</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((room, index) => (
              <tr key={index}>
                <td>{room.roomname}</td>
                <td>{room.gamemode}</td>
                <td>{Array.isArray(room.players) ? room.players.map(player => player.username).join(', ') : ''}</td>
                <Link to="/GuessTheEffect">
                    <button onClick={() => goToRoom(room.roomname, room.roomOwner)}>join</button>
                </Link>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Home;