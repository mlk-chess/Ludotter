import {Injectable} from '@nestjs/common';
import {createAnnouncementDto} from './dto/create-announcement.dto';
import {deleteAnnouncementDto} from './dto/delete-announcement.dto';
import {SupabaseService} from './supabase/supabase.service';
import * as fs from 'fs';
import {v4 as uuidv4} from 'uuid';
import * as path from "path";
import {HttpException} from "@nestjs/common/exceptions/http.exception";
import {HttpStatus} from "@nestjs/common/enums/http-status.enum";
import {updateAnnouncementDto} from "./dto/update-announcement.dto";
import {checkoutAnnouncementDto} from "./dto/checkout-announcement.dto";
import {checkoutLocationAnnouncementDto} from "./dto/checkout-location-announcement.dto";
import {updateCheckoutDto} from "./dto/update-checkout.dto";

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

    async convertOrderingImagesToBase64(announcements) {
        for (const announcement of announcements) {
            if (announcement.announcementId.images && announcement.announcementId.images.length > 0) {
                try {
                    const base64Image = await this.getFile('./uploads/' + announcement.announcementId.images[0]);
                    announcement.announcementId.firstImage = 'data:image/jpeg;base64,' + base64Image;
                    delete announcement.announcementId.images;
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
            .eq('profileId', data.user[0].id)
            .in('status', [0, 1, 2, 3])
            .range(Number(data.from), Number(data.to));

        if (announcements === null) {
            return []
        } else {
            await this.convertImagesToBase64(announcements);

            return announcements;
        }
    }

    async getAllAnnouncements(data) {
        if (data.params.categories.length === 0) {
            const {data: announcements, error} = await this.supabaseService.client
                .from('announcements')
                .select('name, description, images, id, type, status, price, location')
                .in('status', [1, 2])
                .ilike('name', `%${data.params.search}%`)
                .range(Number(data.params.from), Number(data.params.to));

            await this.convertImagesToBase64(announcements);

            return announcements;
        } else {
            const {data: announcements, error} = await this.supabaseService.client
                .from('announcements')
                .select('name, description, images, id, type, status, price, location, announcementCategories(categoryId)')
                .in('status', [1, 2])
                .ilike('name', `%${data.params.search}%`)
                .in('announcementCategories.categoryId', data.params.categories.split(','))
                .range(Number(data.params.from), Number(data.params.to));

            // @ts-ignore
            const filteredArray = announcements.filter(obj => obj.announcementCategories.length !== 0);

            await this.convertImagesToBase64(filteredArray);

            return filteredArray;
        }
    }

    async getAnnouncementById(id: string) {
        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, images, id, type, status, price, location, announcementCategories(category:categoryId(name, id)), profileId(pseudo)')
            .eq('id', id)
            .eq('announcementCategories.announcementId', id);

        if (announcement === null || announcement[0] === undefined) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

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
                profileId: newAnnouncement.user[0].id,
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

        return {statusCode: 201, message: 'Created'};
    }

    async updateAnnouncement(newAnnouncement: updateAnnouncementDto) {
        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, images, id, type, status, price, location, announcementCategories(category:categoryId(name, id))')
            .eq('profileId', newAnnouncement.user[0].id)
            .eq('id', newAnnouncement.id)
            .eq('announcementCategories.announcementId', newAnnouncement.id);

        if (announcement[0].status === 0 || announcement[0].status === 1) {

            announcement[0].images.forEach(image => {
                fs.unlinkSync(`./uploads/${image}`)
            });

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
                        return new HttpException({message: ["Une erreur est survenue pendant la mise à jour de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                });
            }

            const {data, error} = await this.supabaseService.client
                .from('announcements')
                .update([{
                    name: newAnnouncement.name,
                    type: newAnnouncement.type,
                    location: newAnnouncement.city,
                    price: newAnnouncement.price,
                    description: newAnnouncement.description,
                    images: pathImages,
                    status: 0
                }])
                .eq('id', newAnnouncement.id)
                .select();

            if (error) {
                return new HttpException({message: ["Une erreur est survenue pendant la mise à jour de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            this.checkUpdateCategories(newAnnouncement, announcement);

            return {statusCode: 200, message: 'Updated'};
        } else {
            return new HttpException({message: ["Vous ne pouvez pas mettre à jour cette annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async checkUpdateCategories(newAnnouncement, announcement) {
        for (const element of newAnnouncement.selectCategories) {

            if (Array.isArray(announcement[0].announcementCategories)) {
                const elementExists = announcement[0].announcementCategories.some(function (item) {
                    return item.category.id.toString() === element;
                });

                if (!elementExists) {
                    const {error} = await this.supabaseService.client
                        .from('announcementCategories')
                        .insert([{
                            announcementId: newAnnouncement.id,
                            categoryId: element
                        }]);

                    if (error) {
                        console.log(error);
                        return new HttpException({message: ["Une erreur est survenue pendant la mise à jour de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
                    }
                }
            }
        }


        for (const element of announcement[0].announcementCategories) {
            const elementExists = newAnnouncement.selectCategories.some(function (item) {
                return item === element.category.id.toString();
            });

            if (!elementExists) {
                const {error} = await this.supabaseService.client
                    .from('announcementCategories')
                    .delete()
                    .eq('categoryId', element.category.id)
                    .eq('announcementId', newAnnouncement.id);

                if (error) {
                    console.log(error);
                    return new HttpException({message: ["Une erreur est survenue pendant la mise à jour de l'annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
                }
            }
        }
    }

    async deleteAnnouncement(idAnnouncement: deleteAnnouncementDto) {

        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('images, status')
            .eq('profileId', idAnnouncement.user[0].id)
            .eq('id', idAnnouncement.id);

        if (announcement[0].status === 0 || announcement[0].status === 1) {


            const {error} = await this.supabaseService.client
                .from('announcements')
                .update([{
                    status: -2
                }])
                .eq('id', idAnnouncement.id)
                .eq('profileId', idAnnouncement.user[0].id);

            if (error) {
                console.log(error);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            announcement[0].images.forEach(image => {
                fs.unlinkSync(`./uploads/${image}`)
            });

            return {statusCode: 200, message: 'Deleted'};
        } else {
            return new HttpException({message: ["Vous ne pouvez pas supprimer cette annonce"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    async deleteAdminAnnouncement(idAnnouncement: deleteAnnouncementDto) {

        const {data: announcement} = await this.supabaseService.client
            .from('announcements')
            .select('images')
            .eq('id', idAnnouncement.id);

        const {error} = await this.supabaseService.client
            .from('announcements')
            .update([{
                status: -2
            }])
            .eq('id', idAnnouncement.id);

        if (error) {
            console.log(error);
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {statusCode: 200, message: 'Deleted'};
    }

    async getAnnouncementsAdmin() {
        const {data: announcementsAdmin} = await this.supabaseService.client
            .from('announcements')
            .select('name, description, type, id, status, price, profileId(email)');

        return announcementsAdmin;
    }

    async cancelAnnouncement(idAnnouncement: deleteAnnouncementDto) {
        const {error} = await this.supabaseService.client
            .from('announcements')
            .update({status: -1})
            .eq('id', idAnnouncement.id)

        return {statusCode: 200, message: 'Canceled'};
    }

    async publishAnnouncement(idAnnouncement: deleteAnnouncementDto) {
        const {error} = await this.supabaseService.client
            .from('announcements')
            .update({status: 1})
            .eq('id', idAnnouncement.id)

        return {statusCode: 200, message: 'Published'};
    }

    async checkout(checkout: checkoutAnnouncementDto) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

        const {data: announcement, error: errorAnnouncement} = await this.supabaseService.client
            .from('announcements')
            .select('id, type, status, price, profileId, profiles(balance)')
            .eq('id', checkout.id);

        if (errorAnnouncement) {
            console.log(errorAnnouncement);
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (announcement[0] === undefined) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        if (announcement[0].status !== 1) {
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.NOT_FOUND);
        }

        if (announcement[0].type !== 'sale') {
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }


        try {
            const token = await stripe.tokens.create({
                card: {
                    number: checkout.number,
                    exp_month: checkout.expiry.split('/')[0],
                    exp_year: checkout.expiry.split('/')[1],
                    cvc: checkout.cvc,
                    name: checkout.name,
                }
            });

            const charge = await stripe.charges.create({
                amount: announcement[0].price * 100,
                currency: 'eur',
                source: token.id,
            });

            const {data, error} = await this.supabaseService.client
                .from('announcements')
                .update([{
                    status: 3
                }])
                .eq('id', announcement[0].id);

            if (error) {
                console.log(error);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // @ts-ignore
            const newBalance = announcement[0].profiles.balance + announcement[0].price;

            const {data: profileData, error: profileError} = await this.supabaseService.client
                .from('profiles')
                .update([{
                    balance: newBalance
                }])
                .eq('id', announcement[0].profileId);

            if (profileError) {
                console.log(profileError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const {data: userData, error: userError} = await this.supabaseService.client
                .from('profiles')
                .update([{
                    points: checkout.user[0].points + 100
                }])
                .eq('id', checkout.user[0].id);

            if (userError) {
                console.log('Error user update')
                console.log(userError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const {error: checkoutError} = await this.supabaseService.client
                .from('checkout')
                .insert([{
                    announcementId: announcement[0].id,
                    profileId: checkout.user[0].id,
                    paymentIntent: charge.id,
                    price: (announcement[0].price + (5 * announcement[0].price / 100)).toFixed(2),
                    status: 1,
                }]);

            if (checkoutError) {
                console.log(checkoutError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (err) {
            console.log(err);

            if (err.type === 'StripeCardError') {
                return new HttpException({message: ["Les informations de la carte de sont pas correctes"]}, HttpStatus.BAD_REQUEST);
            } else {
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return {
            statusCode: 200, message: 'success',
        };
    }

    async checkoutLocation(checkout: checkoutLocationAnnouncementDto) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

        const {data: announcement, error: errorAnnouncement} = await this.supabaseService.client
            .from('announcements')
            .select('id, type, status, price, profileId, profiles(balance)')
            .eq('id', checkout.id);

        if (errorAnnouncement) {
            console.log('Error announcement');
            console.log(errorAnnouncement);
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (announcement[0] === undefined) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        if (announcement[0].status !== 1 && announcement[0].status !== 2) {
            console.log('Error status');
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.NOT_FOUND);
        }

        if (announcement[0].type !== 'location') {
            console.log('Error type');
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const {data: dataCheckout, error: errorCheckout} = await this.supabaseService.client
            .from('checkout')
            .select()
            .in('status', [0, 1])
            .gte('startDate', checkout.startDate)
            .lte('endDate', checkout.endDate);

        if (dataCheckout.length > 0) {
            console.log('Error date');
            return new HttpException({message: ["Les dates ne sont pas correctes"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (errorCheckout) {
            console.log('Error checkout');
            console.log(errorCheckout);
            return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const differenceInTime = (new Date(checkout.endDate)).getTime() - (new Date(checkout.startDate)).getTime();

        const differenceInDays = (differenceInTime / (1000 * 3600 * 24)) + 1;

        const price = ((announcement[0].price * differenceInDays) + (5 * announcement[0].price * differenceInDays / 100)).toFixed(2);

        try {
            const token = await stripe.tokens.create({
                card: {
                    number: checkout.number,
                    exp_month: checkout.expiry.split('/')[0],
                    exp_year: checkout.expiry.split('/')[1],
                    cvc: checkout.cvc,
                    name: checkout.name,
                }
            });

            const charge = await stripe.charges.create({
                amount: parseFloat(price) * 100,
                currency: 'eur',
                source: token.id,
            });

            const {data, error} = await this.supabaseService.client
                .from('announcements')
                .update([{
                    status: 2
                }])
                .eq('id', announcement[0].id);

            if (error) {
                console.log('Error announcement update');
                console.log(error);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            // @ts-ignore
            const newBalance = announcement[0].profiles.balance + parseFloat(price);

            const {data: profileData, error: profileError} = await this.supabaseService.client
                .from('profiles')
                .update([{
                    balance: newBalance
                }])
                .eq('id', announcement[0].profileId);

            if (profileError) {
                console.log('Error profile update')
                console.log(profileError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const {data: userData, error: userError} = await this.supabaseService.client
                .from('profiles')
                .update([{
                    points: checkout.user[0].points + 100
                }])
                .eq('id', checkout.user[0].id);

            if (userError) {
                console.log('Error user update')
                console.log(userError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

            const {error: checkoutError} = await this.supabaseService.client
                .from('checkout')
                .insert([{
                    announcementId: announcement[0].id,
                    profileId: checkout.user[0].id,
                    paymentIntent: charge.id,
                    status: 0,
                    price: price,
                    startDate: checkout.startDate,
                    endDate: checkout.endDate,
                }]);

            if (checkoutError) {
                console.log('Error checkout insert')
                console.log(checkoutError);
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }

        } catch (err) {
            console.log(err);

            if (err.type === 'StripeCardError') {
                return new HttpException({message: ["Les informations de la carte de sont pas correctes"]}, HttpStatus.BAD_REQUEST);
            } else {
                console.log('Error payment')
                return new HttpException({message: ["Une erreur est survenue pendant le paiement"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return {
            statusCode: 200, message: 'success',
        };
    }

    async checkoutDate() {
        const {data: announcements} = await this.supabaseService.client
            .from('checkout')
            .select('startDate, endDate')
            .in('status', [0, 1])
            .gt('startDate', new Date().toISOString().split('T')[0]);

        return announcements;
    }

    async getOrdering(data) {
        const {data: checkout} = await this.supabaseService.client
            .from('checkout')
            .select('status, id, announcementId(name, description, images, id)')
            .eq('profileId', data.user[0].id);

        if (checkout === null) {
            return []
        } else {
            await this.convertOrderingImagesToBase64(checkout);

            return checkout;
        }
    }

    async getCheckoutById(data) {
        const {data: checkout} = await this.supabaseService.client
            .from('checkout')
            .select('*, announcementId(*)')
            .eq('profileId', data.user[0].id)
            .eq('id', data.id);

        if (checkout === null || checkout[0] === undefined) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        await this.convertAllImagesToBase64(checkout[0].announcementId);

        return checkout;
    }

    async getCheckoutByProfileId(data) {
        const {data: checkout} = await this.supabaseService.client
            .from('checkout')
            .select('*, announcementId(id, profileId)')
            .eq('announcementId.profileId', data.user[0].id)
            .eq('announcementId', data.id);

        if (checkout === null || checkout[0] === undefined) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        return checkout;
    }

    async updateCheckout(checkout: updateCheckoutDto) {
        const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

        const {data: checkoutData, error: checkoutError} = await this.supabaseService.client
            .from('checkout')
            .select('*, announcementId(id, profileId(id, balance))')
            .eq('announcementId.profileId', checkout.user[0].id)
            .eq('id', checkout.id);

        if (checkoutData === null || checkoutData[0] === undefined || checkoutData[0].status !== 0) {
            return new HttpException({message: ["L'annonce n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        if (checkoutError) {
            return new HttpException({message: ["Une erreur est survenue pendant la mise à jour"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        const {error: checkoutUpdate} = await this.supabaseService.client
            .from('checkout')
            .update({status: checkout.status})
            .eq('id', checkout.id);

        if (checkoutUpdate) {
            return new HttpException({message: ["Une erreur est survenue pendant la mise à jour"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (checkout.status === -1) {
            const refund = await stripe.refunds.create({
                charge: checkoutData[0].paymentIntent,
            });

            const {error: checkoutUpdate} = await this.supabaseService.client
                .from('profiles')
                .update({balance: checkoutData[0].announcementId.profileId.balance - checkoutData[0].price})
                .eq('id', checkoutData[0].announcementId.profileId.id);

            if (checkoutUpdate) {
                console.log(checkoutUpdate);
                return new HttpException({message: ["Une erreur est survenue pendant la mise à jour"]}, HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }

        return {statusCode: 200, message: 'Updated'};
    }


    async getPaymentByDate() {

       
        const {data: payment} = await this.supabaseService.client
            .from('checkout')
            .select('*, created_at')
            .eq('status', 1);

       
        for (let i = 0; i < payment.length; i++) {
            payment[i].created_at = payment[i].created_at.split('T')[0];
        }

        const result = payment.reduce((acc, {created_at}) => {
            acc[created_at] = (acc[created_at] || 0) + 1;
            return acc;
        }, {});

       
        const resultArray = Object.keys(result).map((key) => {
            return {date: key, count: result[key]};
        });


        return resultArray;


    }
}