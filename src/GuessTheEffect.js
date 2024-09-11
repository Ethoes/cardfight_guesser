import React, { useContext, useEffect, useState } from 'react';
import { UserContext } from './UserContext';
import './GuessTheEffect.css';

const GuessTheEffect = () => {
  const { currentRoomName, currentRoomOwner, username } = useContext(UserContext);
  const [users, setUsers] = useState([]);
  const [gamePhase, setGamePhase] = useState('');
  const [cardAnswer, setCardAnswer] = useState([]);
  const [shuffledAnswers, setShuffledAnswers] = useState([]);
  const [nonAnswers, setNonAnswers] = useState([]);
  const [hasAnswered, setHasAnswered] = useState(false);

  let cardSamples = [];
  let LastState = '';


  const fetchUsers = async () => {
    try {
      const response = await fetch(`http://localhost:3001/roomStatus?room=${currentRoomName}`);
      const data = await response.json();
      
      setUsers(data.users);
        let setUpQuestion = false;
        
        if(LastState !== data.gamePhase){
          if(data.gamePhase === 'question'){
            setUpQuestion = true;
            setHasAnswered(false);
          }
          LastState = data.gamePhase;
        }

        cardSamples = [];
        cardSamples.push(data.cardSamples);

        if (setUpQuestion) {
          const answers = [...cardSamples[0], data.cardAnswer];
          setShuffledAnswers(prev => shuffleArray(answers));
          setNonAnswers(prev => cardSamples[0]);
          console.log(shuffledAnswers)
        }
      setGamePhase(data.gamePhase);
      setCardAnswer(data.cardAnswer);
      
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
    var isCorrect = false;
    if (selectedCard?.name === cardAnswer?.name) {
      isCorrect = true;
    } 

    setHasAnswered(true);
    fetch(`http://localhost:3001/answer?room=${currentRoomName}&anwser=${selectedCard?.name}&username=${username}`, {
      method: 'PUT'
    })
      .then(response => {
        if (response.ok) {
          // Game started successfully
          // Add your code here
        } else {
          throw new Error('Failed send result');
        }
      })
      .catch(error => {
        console.error('Error sending result:', error);
      });
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
      {currentRoomOwner === username && gamePhase === 'nextQuestion' && (
        <button onClick={() => startGame()}>next question</button>
      )}
      <div>
      <h3>Current Users:</h3>
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Last Answer</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr key={index}>
                <td>{user.username}</td>
                <td>{user.lastAwnser}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {gamePhase === 'question' && (
        <div className="question" style={{ position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h1>What is the effect of the following card? </h1>
          <h1>{cardAnswer?.name}</h1>
        </div>
      )}

      {gamePhase === 'nextQuestion' && (
        <div className="question" style={{ position: 'absolute', top: '35%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          <h1>{cardAnswer?.name}</h1>
          <img src={cardAnswer?.imageurlen} alt="Card Image" style={{width: '65%'}} />
        </div>
      )}

      {gamePhase === 'nextQuestion' && (
        <div style={{ position: 'absolute', top: '85%', left: '50%', transform: 'translate(-50%, -50%)', textAlign: 'center' }}>
          {nonAnswers.map(card => (
            <img key={card.name} src={card?.imageurlen} style={{width: '25%'}} />
          ))}
      </div>
      )}

      {!hasAnswered && (
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', display: 'flex', justifyContent: 'center', gap: '10px' }}>
          {shuffledAnswers.map((card, index) => (
            <button key={index} onClick={() => handleAnswer(card)}>
              {card?.effect}
            </button>
          ))}
        </div>
      )}
{/* 
      <div style={{ position: 'absolute', top: '90%', left: '50%', transform: 'translate(-50%, -50%)' }}>
        <h1>Current Game Phase: {gamePhase}</h1>
      </div> */}
    </div>
  );
};

export default GuessTheEffect;