import {IsNotEmpty} from 'class-validator';
import {IsIn} from "class-validator/types/decorator/common/IsIn";

export class createAnnouncementDto {
    @IsNotEmpty({message: 'Le champ nom est vide'})
    name: string;

    @IsNotEmpty({message: "Le champ prix est vide"})
    price: number;

    @IsNotEmpty({message: "Le champ description est vide"})
    description: string;

    @IsNotEmpty({message: "Le champ image est vide"})
    selectImages: any;

    @IsNotEmpty({message: "Le champ ville est vide"})
    city: string;

    @IsNotEmpty({message: "Le champ type est vide"})
    @IsIn(['location', 'sale'])
    type: string;
}