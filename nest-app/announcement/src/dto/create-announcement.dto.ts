import {IsNotEmpty, ValidateNested, IsIn} from 'class-validator';

class ImageDto {
    @IsNotEmpty({ message: 'Le champ name de l\'image est vide' })
    name: string;
    @IsNotEmpty({ message: 'Le champ base64 de l\'image est vide' })
    base64: string;
}

export class createAnnouncementDto {
    @IsNotEmpty({message: 'Le champ nom est vide'})
    name: string;

    @IsNotEmpty({message: "Le champ prix est vide"})
    price: string;

    @IsNotEmpty({message: "Le champ description est vide"})
    description: string;

    @IsNotEmpty({message: "Le champ image est vide"})
    @ValidateNested({ each: true })
    selectImages: ImageDto[];

    @IsNotEmpty({message: "Le champ ville est vide"})
    city: string;

    @IsNotEmpty({message: "Le champ type est vide"})
    @IsIn(['location', 'sale'])
    type: string;

    @IsNotEmpty({message: "Le champ user est vide"})
    user: any;

    selectCategories: string[];
}