import React, { useState } from 'react';
import Card from './Card';
import Row from './Row';

const Scroll = () => {
    
  const [playing, setPlaying] = useState(true);

  const cardDetails = [
    {
      id: 0,
      avatar: './splendor.webp',
    },
    {
      id: 1,
      avatar:
        './when.png',
    },
    {
      id: 2,
      avatar:
      './skull.webp',

    },
    {
      id: 3,
      avatar:
      './splendor.webp',
    },
    {
      id: 4,
      avatar:
      './when.png',
    },
    {
      id: 5,
      avatar:
      './wonders.png',
    },
  ];
  

  return (
    <div className="test flex flex-col justify-center items-center overflow-hidden">
      <Row speed={100} playing={playing}>
        {cardDetails.map((card, idx) => (
          <Card key={idx} card={card} />
        ))}
      </Row>
    </div>
  );
};

export default Scroll;
