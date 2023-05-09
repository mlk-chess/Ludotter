import React from 'react';

interface CardProps {
    card: {
        avatar: string;
        // d'autres propriétés de la carte si nécessaire
    };
}

const Card: React.FC<CardProps> = ({ card }) => {
    return (
        <div className="w-60 mr-7 flex flex-col self-center justify-between transition ease-in-out delay-150 hover:scale-110 duration-500">
            <img src={card?.avatar} alt="game picture"/>
        </div>
    );
};

export default Card;
