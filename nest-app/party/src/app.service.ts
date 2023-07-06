import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { createPartyDto } from './dto/create-party.dto';
import { createPartyAdminDto } from './dto/create-party-admin.dto';
import { updatePartyDto } from './dto/update-party.dto';
import { joinPartyDto } from './dto/join-party.dto';
import { SupabaseService } from './supabase/supabase.service';
import { updatePartyAdminDto } from './dto/update-party-admin.dto';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  async getParties() {

    const { data: Parties, error } = await this.supabaseService.client
      .from('party')
      .select('*');

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { Parties, statusCode: 200, message: "OK" };
  }

  // get my parties
  async getMyParties(user:any) {

    const { data: partyProfiles, error : errUser } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('profileId', user.user[0].id);

      if (errUser) {
        return new HttpException({ message: ["Une erreur est survenue à propos de l'utilisateur."] }, HttpStatus.BAD_REQUEST);
      }

    // Get all parties according to partyProfiles
    const { data: parties, error } = await this.supabaseService.client
      .from('party')
      .select('*')
      .eq('owner', user.user[0].id);

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue à propos des parties."] }, HttpStatus.BAD_REQUEST);
    }

    return { parties, partyProfiles, statusCode: 200, message: "OK" };
  }

  async getAllPartipants() {
    const { data: partyProfiles, error: errPartyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .neq('status', -2);

    // Get all participants from profiles according to partyProfiles and party where status is not -1 or -2
    const { data: profiles, error: errProfiles } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .in('id', partyProfiles.map(profile => profile.profileId))
      .neq('status', -1)
      .neq('status', -2);


    // Get all parties according to partyProfiles
    const { data: parties, error: errParties } = await this.supabaseService.client
      .from('party')
      .select('*')
      .in('id', partyProfiles.map(profile => profile.partyId));

    if (errPartyProfiles || errProfiles || errParties) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { profiles, parties, partyProfiles, statusCode: 200, message: "OK" };
  }

  // get all participants from a specific party
  async getParticipants(partyId: string) {
    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partyId)
      .neq('status', -2);

    // Get all participants from profiles according to partyProfiles
    const { data: profiles, error } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .in('id', partyProfiles.map(profile => profile.profileId));

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { partyProfiles, profiles, statusCode: 200, message: "OK" };
  }

  // decline a participant from a specific party putting status -1
  async declineParticipant(partydata: any) {

    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partydata?.partyId)
      .eq('profileId', partydata?.profileId);

    const { error } = await this.supabaseService.client
      .from('partyProfiles')
      .update([
        {
          status: -1,
        },
      ])
      .eq('partyId', partydata?.partyId)
      .eq('profileId', partydata?.profileId);

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 200, message: "Updated" }
  }

  // accept a participant from a specific party putting status 1
  async acceptParticipant(partydata: any) {

    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partydata?.partyId)
      .eq('profileId', partydata?.profileId);

    const { error } = await this.supabaseService.client
      .from('partyProfiles')
      .update([
        {
          status: 1,
        },
      ])
      .eq('partyId', partydata?.partyId)
      .eq('profileId', partydata?.profileId);

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 200, message: "Participant accepté" }
  }

  async saveParty(newParty: createPartyDto) {

    const checkers = await this.checkAllCheckers(newParty);

    if (checkers.statusCode !== 200) {
      return new HttpException({ message: checkers.message }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .insert([
        {
          name: newParty.name,
          description: newParty.description,
          location: newParty.location,
          players: newParty.players,
          owner: newParty.owner,
          time: newParty.time,
          zipcode: newParty.zipcode,
          dateParty: newParty.dateParty,
        },
      ]);

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue. Veuillez contacter l'administrateur."] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 201, message: "Created" }
  }

  async joinParty(joinParty: joinPartyDto) {

    //  Delete all partyProfile having same partyId and profileId and status -2
    const { error: error2 } = await this.supabaseService.client
      .from('partyProfiles')
      .delete()
      .eq('partyId', joinParty.partyId)
      .eq('profileId', joinParty.profileId)
      .eq('status', -2);

    if (error2) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }
 
    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', joinParty.partyId)
      .eq('profileId', joinParty.profileId)
      .neq('status', -2);

    const userAlreadyInParty = partyProfiles.some(profile => profile.profileId === joinParty.profileId);

    const checkPartyFull = await this.checkPartyFull(joinParty.partyId);
    if (checkPartyFull.statusCode !== 200) {
      return new HttpException({ message: [checkPartyFull.message] }, HttpStatus.BAD_REQUEST);
    }

    if (userAlreadyInParty) {
      return new HttpException({ message: ["L'utilisateur est déjà dans la soirée."] }, HttpStatus.BAD_REQUEST);
    }

    // Check if a user has not left the party since the last 10 minutes
    const { data: partyProfiles3 } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', joinParty.partyId)
      .eq('profileId', joinParty.profileId)
      .eq('status', -2);

    if (partyProfiles3.length !== 0) {
      const today = new Date();
      const timeToJoin = new Date(partyProfiles3[partyProfiles3.length - 1].created_at);
      timeToJoin.setMinutes(timeToJoin.getMinutes() + 10);

      if (today < timeToJoin) {
        return new HttpException({ message: [" Vous devez attendre un moment avant de pouvoir rejoindre la fête."] }, HttpStatus.BAD_REQUEST);
      }
    }

    const { error } = await this.supabaseService.client
      .from('partyProfiles')
      .insert([
        {
          partyId: joinParty.partyId,
          profileId: joinParty.profileId,
        },
      ]);

    if (error) {
      throw error;
    }

    return { statusCode: 201, message: "Created" }
  }


  async getPartyByName(name: string) {
    const { data: party } = await this.supabaseService.client
      .from('party')
      .select('*')
      .eq('name', name);

    return party;
  }

  async getPartyById(id: string) {
    console.log(id);
    const { data: party } = await this.supabaseService.client
      .from('party')
      .select('*')
      .eq('id', id);

    return { party, statusCode: 200, message: "OK" };
  }

  async updateParty(updateParty: updatePartyDto) {
    const getParty = await this.getPartyById(updateParty.id);

    if (getParty.party.length == 0) {
      return new HttpException({ message: ["La soirée n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    const checkers = await this.checkAllCheckers(updateParty);

    if (checkers.statusCode !== 200) {
      return new HttpException({ message: checkers.message }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .update([
        {
          name: updateParty.name.toLowerCase(),
          description: updateParty.description,
          location: updateParty.location,
          players: updateParty.players,
          owner: updateParty.owner,
          time: updateParty.time,
          zipcode: updateParty.zipcode,
          dateParty: updateParty.dateParty,
        },
      ])
      .eq('id', updateParty.id)

      if (error) {
        return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
      }

    return { statusCode: 200, message: "Updated" }
  }

  // Function to delete party changing status to -1
  async deleteParty(id: string) {
    const getParty = await this.getPartyById(id);

    if (getParty.party.length == 0) {
      return new HttpException({ message: ["La soirée n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .update([
        {
          status: -1,
        },
      ])
      .eq('id', id)

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue lors de la suppression de la fête."] }, HttpStatus.BAD_REQUEST);
    }

    // Delete all partyProfiles putting status to -2
    const { error : error2 } = await this.supabaseService.client
      .from('partyProfiles')
      .update([
        { 
          status: -2,
        },
      ])
      .eq('partyId', id);

    if (error2) {
      return new HttpException({ message: ["Une erreur est survenue lors de la suppression des participants."] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 204, message: "Deleted" }
  }

  // Function to leave party putting status to -2
  async leaveParty(dataToLeave: any) {

    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', dataToLeave.partyId);

    const userAlreadyInParty = partyProfiles.some(profile => profile.profileId === dataToLeave.profileId);

    if (!userAlreadyInParty) {
      return new HttpException({ message: ["L'utilisateur n'est pas dans la soirée."] }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('partyProfiles')
      .update([
        {
          status: -2,
        },
      ])
      .eq('partyId', dataToLeave.partyId)
      .eq('profileId', dataToLeave.profileId);

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue. Contactez l'administrateur"] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 204, message: "Deleted" }
  }

  async savePartyAdmin(newParty: createPartyAdminDto) {

    const checkers = await this.checkAllCheckers(newParty);

    if (checkers.statusCode !== 200) {
      return new HttpException({ message: checkers.message }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .insert([
        {
          name: newParty.name.toLowerCase(),
          description: newParty.description,
          location: newParty.location,
          players: newParty.players,
          owner: newParty.owner,
          time: newParty.time,
          zipcode: newParty.zipcode,
          dateParty: newParty.dateParty,
          status: newParty.status,
        },
      ]);

    

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue. Veuillez contacter l'administrateur."] }, HttpStatus.BAD_REQUEST);
    }
    return { statusCode: 201, message: "Created" }
  }

  // Update party admin
  async updatePartyAdmin(updateParty: updatePartyAdminDto) {
    const getParty = await this.getPartyById(updateParty.id);

    if (getParty.party.length == 0) {
      return new HttpException({ message: ["La soirée n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    const checkers = await this.checkAllCheckers(updateParty);
    
    if (checkers.statusCode !== 200) {
      return new HttpException({ message: checkers.message }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .update([
        {
          name: updateParty.name.toLowerCase(),
          description: updateParty.description,
          location: updateParty.location,
          players: updateParty.players,
          owner: updateParty.owner,
          time: updateParty.time,
          zipcode: updateParty.zipcode,
          dateParty: updateParty.dateParty,
          status: updateParty.status,
        },
      ])
      .eq('id', updateParty.id)

    if (error) {
      return new HttpException({ message: ["Une erreur est survenue."] }, HttpStatus.BAD_REQUEST);
    }

    return { statusCode: 200, message: "Updated" }
  }




  // Checkers

  async checkDate(dateParty: Date, time: any) {
    const today = new Date();
    const dateToCheck = new Date(dateParty);
    dateToCheck.setDate(dateToCheck.getDate());
    dateToCheck.setHours(time.split(":")[0]);
    dateToCheck.setMinutes(time.split(":")[1]);

    if (
      today.getDate() === dateToCheck.getDate() &&
      today.getMonth() === dateToCheck.getMonth() &&
      today.getFullYear() === dateToCheck.getFullYear() &&
      dateToCheck.getHours() - today.getHours() <= 2)
      return { statusCode: 400, message: "L'heure est trop tôt pour organiser une fête." }

    if (today > dateToCheck)
      return { statusCode: 400, message: "La date de la soirée doit être supérieure à la date actuelle." }

    return { statusCode: 200, message: "OK" }
  }

  async checkZipcode(zipcode: number) {
    const regex = /^[0-9]{5}$/;
    if (!regex.test(zipcode.toString())) {
      return { statusCode: 400, message: "Le code postal est incorrect." }
    }
    return { statusCode: 200, message: "OK" }
  }

  // Check if there are participants in the party
  async checkParticipantsNumbers(partyId: string) {
    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partyId);

    if (partyProfiles.length > 0) {
      return new HttpException({ message: ["La soirée contient des participants."] }, HttpStatus.BAD_REQUEST);
    }
    return { statusCode: 200, message: "OK" }
  }

  // Check if the party is full
  async checkPartyFull(partyId: string) {
    const { data: party } = await this.supabaseService.client
      .from('party')
      .select('*')
      .eq('id', partyId)
      .neq('status', -1)
      .neq('status', -2);

    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partyId)
      .neq('status', -2)
      .neq('status', -1)
      .neq('status', 0);

    console.log(partyProfiles.length);
    console.log(party);
    if (partyProfiles.length >= party[0].players) {
      return { statusCode: 404, message: "La soirée est déjà pleine !" }
    }
    return { statusCode: 200, message: "OK" }
  }

  // Check if the user exists
  async checkUserExists(profileId: string) {
    const { data: profile } = await this.supabaseService.client
      .from('profiles')
      .select('*')
      .eq('id', profileId)
      .eq('status', 1);

    if (profile.length === 0) {
      return { statusCode: 404, message: "L'utilisateur n'existe pas ou n'est pas disponible !" }
    }
    return { statusCode: 200, message: "OK" }
  }

  // Check if a user has not left the party since the last 10 minutes
  async checkTimeToJoin(partyId: string, profileId: string) {
    const { data: partyProfiles } = await this.supabaseService.client
      .from('partyProfiles')
      .select('*')
      .eq('partyId', partyId)
      .eq('profileId', profileId)
      .eq('status', -1);

    const today = new Date();
    const timeToJoin = new Date(partyProfiles[0].createdAt);
    timeToJoin.setMinutes(timeToJoin.getMinutes() + 10);

    if (today < timeToJoin) {
      return new HttpException({ message: ["Vous ne pouvez pas rejoindre la soirée."] }, HttpStatus.BAD_REQUEST);
    }
    return { statusCode: 200, message: "OK" }
  }

  async checkAllCheckers(newParty: createPartyDto) {
    const errors = [];

    const checkUserExists = await this.checkUserExists(newParty.owner);
    if (checkUserExists.statusCode !== 200) {
      errors.push(checkUserExists.message);
    }

    const checkDate = await this.checkDate(newParty.dateParty, newParty.time);
    if (checkDate.statusCode !== 200) {
      errors.push(checkDate.message);
    }

    const checkZipcode = await this.checkZipcode(newParty.zipcode);
    if (checkZipcode.statusCode !== 200) {
      errors.push(checkZipcode.message);
    }

    if (errors.length > 0) {
      return { statusCode: 400, message: errors };
    }

    return { statusCode: 200, message: "OK" }
  }

}
