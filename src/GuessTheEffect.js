import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';

const GuessTheEffect = () => {
  const { currentRoomName, currentRoomOwner, username } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [gamePhase, setGamePhase] = useState('');
  const [cardAnswer, setCardAnswer] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  let cardSamples = [];


  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/roomStatus?room=${currentRoomName}`);
      const data = await response.json();
      
      setUsers(data.users);
      console.log('gamePhase', gamePhase);
      console.log('data.gamePhase', data.gamePhase);
      // if(data.gamePhase !== gamePhase) {
        cardSamples = [];
        cardSamples.push(data.cardSamples);
        if (cardAnswer && cardSamples[0].length === 4) {
          const answers = [...cardSamples[0], cardAnswer];
          setShuffledAnswers(prev => shuffleArray(answers));
          // console.log('shuffledAnswers', shuffledAnswers[0]?.name);
        }
      setGamePhase(data.gamePhase);
      setCardAnswer(data.cardAnswer);
      // }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
    const interval = setInterval(fetchUsers, 1000);
    return () => clearInterval(interval);
  }, [currentRoomName]);


  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const handleAnswer = (selectedCard) => {
    if (selectedCard === cardAnswer) {
      alert('Correct!');
    } else {
      alert('Incorrect!');
    }
  };

  const startGame = () => {
    fetch(`http://localhost:3001/startGame?room=${currentRoomName}`, {
      method: 'PUT'
    })
      .then(response => {
        if (response.ok) {
          // Game started successfully
          // Add your code here
        } else {
          throw new Error('Failed to start game');
        }
      })
      .catch(error => {
        console.error('Error starting game:', error);
      });
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: 0, right: 0, padding: '10px' }}>
        Current Room: {currentRoomName}
      </div>
      <div style={{ position: 'absolute', top: 15, right: 0, padding: '10px' }}>
        Username: {username}
      </div>
      {currentRoomOwner === username && gamePhase === 'lobby' && (
        <button onClick={() => startGame()}>Start Game</button>
      )}
      <div>
        <h3>Current Users:</h3>
        <ul>
          {users.map((user, index) => (
            <li key={index}>{user}</li>
          ))}
        </ul>
      </div>

      <div className="question" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
        <h1>What is the effect of the following card? </h1>
        <h1>{cardAnswer?.name}</h1>
      </div>

      <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {shuffledAnswers.map((card, index) => (
          <button key={index} onClick={() => handleAnswer(card)}>
            {card.effect}
          </button>
        ))}
      </div>

      <div style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <h1>Current Game Phase: {gamePhase}</h1>
      </div>
    </div>
  );
};

export default GuessTheEffect;