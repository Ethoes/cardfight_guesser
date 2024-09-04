const express = require('express');
const app = express();
const port = 3001;

const cors = require('cors');
app.use(cors());

let rooms = [];
let cards = [];

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
  fetchAllCards();
});

app.post('/newRoom', express.json(), (req, res) => {
  const room = req.body;
  room.cards = cards.filter(card => room.chosenBoosters.some(booster => card.sets?.includes(booster)));
  rooms.push(room);
  res.json({ success: true });

  console.log('rooms', rooms);
});

app.get('/rooms', (req, res) => {
  res.json({ rooms: rooms });
});

app.get('/roomStatus', (req, res) => {
  const roomName = req.query.room;
  const room = rooms.find(room => room.roomname === roomName);
  res.json({ users: room?.players || [], 
            gamePhase: room?.gamePhase || 'lobby',
            cardAnswer: room?.cardAnswer,
            cardSamples: room?.cardSamples
            });
});

app.put('/startGame', express.json(), (req, res) => {
  console.log('startGame', req.query.room);
  const roomName = req.query.room;
  const roomIndex = rooms.findIndex(room => room.roomname === roomName);
  if (roomIndex !== -1) {
    const room = rooms[roomIndex];
    room.gamePhase = 'question';
    room.cardAnswer = room.cards[Math.floor(Math.random() * room.cards.length)];
    const foundCards = [];
    while (foundCards.length < 4) {
      const randomCard = room.cards[Math.floor(Math.random() * room.cards.length)];
      if (randomCard !== room.cardAnswer && !foundCards.includes(randomCard)) {
        foundCards.push(randomCard);
      }
    }
    room.cardSamples = foundCards;
    res.json({ success: true });
  } else {
    res.json({ success: false, message: 'Room not found' });
  }
});

app.put('/addplayer', express.json(), (req, res) => {
  const roomName = req.body.room;
  const player = req.body.player;
  const roomIndex = rooms.findIndex(room => room.roomname === roomName);
  if (roomIndex !== -1) {
    const room = rooms[roomIndex];
    if (!room.players.includes(player)) {
      room.players.push(player);
      res.json({ success: true });
    } else {
      res.json({ success: false, message: 'Player already exists in the room' });
    }
  } else {
    res.json({ success: false, message: 'Room not found' });
  }
});

const fetchAllCards = async () => {
  const fetch = (await import('node-fetch')).default;
  let page = 1;
  let pageSize = 1000;
  let cardsData = [];

  while (page <= 10) {
    const response = await fetch(`https://card-fight-vanguard-api.ue.r.appspot.com/api/v1/cards?pagesize=${pageSize}&page=${page}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} ${response.statusText}`);
      break;
    }

    const data = await response.json();

    if (data?.data.length > 0) {
      cardsData = cardsData.concat(data?.data);
      page++;
    } else {
      break;
    }
  }

  cardsData = cardsData.filter(card => card.format !== "Vanguard ZERO");
  cards = cardsData;
  console.log('finished fetching cards');
};