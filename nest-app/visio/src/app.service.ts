import {HttpException, HttpStatus, Injectable} from '@nestjs/common';
import {SupabaseService} from './supabase/supabase.service';
import {addDto} from "./dto/add.dto";
import {deleteDto} from "./dto/delete.dto";

@Injectable()
export class AppService {

    constructor(private supabaseService: SupabaseService) {
    }

    async getHello(data) {
        const {data: visio, error} = await this.supabaseService.client
            .from('visio')
            .select('id, date, startTime')
            .eq('profileId', data.user[0].id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (visio === null) {
            return []
        } else {
            const tmpVisio = visio.map(objet => {
                const {['date']: valeur, ...rest} = objet;  // Opérateur de déconstruction pour extraire la valeur de l'ancienne clé
                return {['date']: valeur, ['dateVisio']: valeur, ...rest};  // Nouvel objet avec les clés dupliquées et renommées
            });

            const newVisio = tmpVisio.map(({
                                               startTime: title,
                                               ...rest
                                           }) => ({
                title,
                ...rest
            }));

            return newVisio;
        }
    }

    async getAll(data) {
        const {data: visio, error} = await this.supabaseService.client
            .from('visio')
            .select('id, date, startTime, checkoutVisio(*)')
            .eq('checkoutVisio.profileId', data.user[0].id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (visio === null) {
            return []
        } else {
            const tmpVisio = visio.map(objet => {
                const {['date']: valeur, ...rest} = objet;  // Opérateur de déconstruction pour extraire la valeur de l'ancienne clé
                return {['date']: valeur, ['dateVisio']: valeur, ...rest};  // Nouvel objet avec les clés dupliquées et renommées
            });

            const newVisio = tmpVisio.map(({
                                               startTime: title,
                                               ...rest
                                           }) => ({
                title,
                ...rest
            }));

            return newVisio;
        }
    }

    async add(data: addDto) {
        const startTime = new Date(`2000/01/01 ${data.startTime}`);
        const endTime = new Date(`2000/01/01 ${data.endTime}`);

        const startTime_60 = new Date(startTime.getTime() + (60 * 60000));

        if (endTime < startTime_60) {
            return new HttpException({message: ["L'heure de fin doit être au minimum 1h après la date de début"]}, HttpStatus.BAD_REQUEST);
        }

        const date = new Date(data.date);

        const today = new Date();

        if (date <= today) {
            return new HttpException({message: ["La date doit être supérieure à aujourd'hui"]}, HttpStatus.BAD_REQUEST);
        }

        const {error} = await this.supabaseService.client
            .from('visio')
            .insert([{
                date: data.date,
                startTime: data.startTime,
                endTime: data.endTime,
                profileId: data.user[0].id,
            }]);
        if (error) {
            return new HttpException({message: ["Une erreur est survenue pendant la création de la disponibilité"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {statusCode: 201, message: 'Created'};
    }

    async deleteVisio(data: deleteDto) {
        const {data: visio, error} = await this.supabaseService.client
            .from('visio')
            .select('date')
            .eq('profileId', data.user[0].id)
            .eq('id', data.id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (visio === null || visio === undefined) {
            return new HttpException({message: ["Cette disponibilité n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        const date = new Date(visio[0].date);

        const today = new Date();

        if (date <= today) {
            return new HttpException({message: ["Impossible de supprimer cette disponibilité"]}, HttpStatus.BAD_REQUEST);
        }

        const {error: errorDelete} = await this.supabaseService.client
            .from('visio')
            .delete()
            .eq('profileId', data.user[0].id)
            .eq('id', data.id);

        if (errorDelete) {
            return new HttpException({message: ["Une erreur est survenue pendant la suppression"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {statusCode: 200, message: 'Deleted'};
    }

    async checkout(data: deleteDto) {
        const {data: visio, error} = await this.supabaseService.client
            .from('visio')
            .select('date')
            .eq('id', data.id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (visio === null || visio === undefined) {
            return new HttpException({message: ["Cette disponibilité n'existe pas"]}, HttpStatus.NOT_FOUND);
        }

        const date = new Date(visio[0].date);

        const today = new Date();

        if (date < today) {
            return new HttpException({message: ["Impossible de réserver cette disponibilité"]}, HttpStatus.BAD_REQUEST);
        }

        const {data: checkout, error: errorCheckout} = await this.supabaseService.client
            .from('checkoutVisio')
            .select('*')
            .eq('profileId', data.user[0].id)
            .eq('visioId', data.id);

        if (errorCheckout) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        if (checkout !== null && checkout !== undefined && checkout.length > 0) {
            return new HttpException({message: ["Vous avez déjà réservé cette disponibilité"]}, HttpStatus.BAD_REQUEST);
        }

        const {error: visioError} = await this.supabaseService.client
            .from('checkoutVisio')
            .insert([{
                visioId: data.id,
                profileId: data.user[0].id,
            }]);

        if (visioError) {
            console.log(visioError);
            return new HttpException({message: ["Une erreur est survenue pendant la réservation de la disponibilité"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return {statusCode: 201, message: 'Created'};
    }

    async getMyMeetings(data){

        const today = new Date().toISOString().split('T')[0];

        const {data: visio, error} = await this.supabaseService.client
        .from('checkoutVisio')
        .select('id, visio(*, profiles(firstname,name))')
        .gt('visio.date', today)
        .eq('profileId', data.user[0].id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return visio;
    }

    async getMyVisio(data){
        const today = new Date().toISOString().split('T')[0];

        const {data: visio, error} = await this.supabaseService.client
        .from('visio')
        .select('*, profiles(firstname,name))')
        .gt('date', today)
        .eq('profileId', data.user[0].id);

        if (error) {
            return new HttpException({message: ["Une erreur est survenue"]}, HttpStatus.INTERNAL_SERVER_ERROR);
        }

        return visio;
    }
}