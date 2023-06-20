import {Injectable} from '@nestjs/common';
import {createAnnouncementDto} from './dto/create-announcement.dto';
import {deleteAnnouncementDto} from './dto/delete-announcement.dto';
import {SupabaseService} from './supabase/supabase.service';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import * as path from "path";
import {HttpException} from "@nestjs/common/exceptions/http.exception";
import {HttpStatus} from "@nestjs/common/enums/http-status.enum";

@Injectable()
export class AppService {
    constructor(private supabaseService: SupabaseService) {
    }

    async getFile(filePath: string): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(filePath, {encoding: 'base64'}, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data);
                }
            });
        });
    }

    async convertImagesToBase64(announcements) {
        for (const announcement of announcements) {
            if (announcement.images && announcement.images.length > 0) {
                try {
                    const base64Image = await this.getFile('./uploads/' + announcement.images[0]);
                    announcement.firstImage = 'data:image/jpeg;base64,' + base64Image;
                    delete announcement.images;
                } catch (error) {
                    console.error(`Failed to convert image to base64: ${error.message}`);
                }
            }
        }
    }

    async convertAllImagesToBase64(announcement) {
        if (announcement.images && announcement.images.length > 0) {
            try {
                announcement.base64Images = [];

                for (const image of announcement.images) {
                    const base64Image = await this.getFile('./uploads/' + image);
                    announcement.base64Images.push('data:image/jpeg;base64,' + base64Image);
                }
                delete announcement.images;
            } catch (error) {
                console.error(`Failed to convert image to base64: ${error.message}`);
            }
        }

    }

    async getAnnouncements(data) {
        const {data: announcements} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, images, id, status')
            .eq('profileId', '72d1498a-3587-429f-8bec-3fafc0cd47bd')
            .range(Number(data.params.from), Number(data.params.to));

        await this.convertImagesToBase64(announcements);

        return announcements;
    }

    async getAnnouncementById(id: string) {
        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, images, id, type, status, price, location, announcementCategories(category:categoryId(name, id)  )')
            .eq('profileId', '72d1498a-3587-429f-8bec-3fafc0cd47bd')
            .eq('id', id)
            .eq('announcementCategories.announcementId', id);

        await this.convertAllImagesToBase64(announcement[0]);

        return announcement;
    }

    async saveAnnouncement(newAnnouncement: createAnnouncementDto) {
        let pathImages = [];

        for (let i = 0; i < newAnnouncement.selectImages.length; i++) {
            const image = newAnnouncement.selectImages[i];
            let base64Image = image.base64.split(';base64,').pop();

            const fileExtension = path.extname(image.name);
            const uniqueFilename = `${uuidv4()}${fileExtension}`;

            if (fileExtension !== '.jpg' && fileExtension !== '.jpeg' && fileExtension !== '.png') {
                return new HttpException({message: ["Les fichiers ne sont pas des images"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            pathImages.push(uniqueFilename);

            fs.writeFile(`./uploads/${uniqueFilename}`, base64Image, {encoding: 'base64'}, function (err) {
                if (err) {
                    return new HttpException({message: ["Une erreur est survenue pendant la création de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            });
        }

        const {data, error} = await this.supabaseService.client
            .from('announcements')
            .insert([{
                name: newAnnouncement.name,
                type: newAnnouncement.type,
                profileId: '72d1498a-3587-429f-8bec-3fafc0cd47bd',
                location: newAnnouncement.city,
                price: newAnnouncement.price,
                description: newAnnouncement.description,
                images: pathImages
            }])
            .select();

        if (error) {
            return new HttpException({message: ["Une erreur est survenue pendant la création de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        for (let i = 0; i < newAnnouncement.selectCategories.length; i++) {
            const {error} = await this.supabaseService.client
                .from('announcementCategories')
                .insert([{
                    announcementId: data[0].id,
                    categoryId: newAnnouncement.selectCategories[i]
                }]);

            if (error) {
                console.log(error);
                return new HttpException({message: ["Une erreur est survenue pendant la création de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return {codeStatus: 201, message: 'Created'};
    }

    async deleteAnnouncement(idAnnouncement: deleteAnnouncementDto) {

        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('images')
            .eq('profileId', '72d1498a-3587-429f-8bec-3fafc0cd47bd')
            .eq('id', idAnnouncement.id);

        const { error } = await this.supabaseService.client
            .from('announcements')
            .delete()
            .eq('id', idAnnouncement.id)
            .eq('profileId', '72d1498a-3587-429f-8bec-3fafc0cd47bd');

        announcement[0].images.forEach(image => {
            fs.unlinkSync(`./uploads/${image}`)
        });

        return {codeStatus: 201, message: 'Deleted'};
    }

    async deleteAdminAnnouncement(idAnnouncement: deleteAnnouncementDto) {

        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('images')
            .eq('id', idAnnouncement.id);

        const { error } = await this.supabaseService.client
            .from('announcements')
            .delete()
            .eq('id', idAnnouncement.id);

        announcement[0].images.forEach(image => {
            fs.unlinkSync(`./uploads/${image}`)
        });

        return {codeStatus: 201, message: 'Deleted'};
    }

    async getAnnouncementsAdmin() {
        const {data: announcementsAdmin} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, type, id, status, price');

        return announcementsAdmin;
    }

    async cancelAnnouncement(idAnnouncement: deleteAnnouncementDto) {
        const { error } = await this.supabaseService.client
            .from('announcements')
            .update({ status: -1 })
            .eq('id', idAnnouncement.id)

        return {codeStatus: 201, message: 'Canceled'};
    }

    async publishAnnouncement(idAnnouncement: deleteAnnouncementDto) {
        const { error } = await this.supabaseService.client
            .from('announcements')
            .update({ status: 1 })
            .eq('id', idAnnouncement.id)

        return {codeStatus: 201, message: 'Published'};
    }
}