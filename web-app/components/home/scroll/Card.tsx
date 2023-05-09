import React from 'react';

const Card = ({ card }) => {
 
  return (
    <div className="w-60 mr-7 flex flex-col self-center justify-between transition ease-in-out delay-150 hover:scale-110 duration-500">
          <img src={card?.avatar} />
    </div>
  );
};

export default Card;
