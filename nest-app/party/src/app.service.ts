import { HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { createPartyDto } from './dto/create-party.dto';
import { updatePartyDto } from './dto/update-party.dto';
import { SupabaseService } from './supabase/supabase.service';

@Injectable()
export class AppService {

  constructor(private supabaseService: SupabaseService) { }

  async getParties() {

    const { data: Partys } = await this.supabaseService.client
      .from('party')
      .select('*');

    return Partys;
  }

  async saveParty(newParty: createPartyDto) {

    const getParty = await this.getPartyByName(newParty.name.toLowerCase());

    if (getParty.length > 0) {
      return new HttpException({ message: ["Cette catégorie existe déjà."] }, HttpStatus.BAD_REQUEST);
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .insert([{ name: newParty.name.toLowerCase() }]);

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
    const { data: party } = await this.supabaseService.client
      .from('party')
      .select('*')
      .eq('id', id);

    return party
  }

  async updateParty(updateParty: updatePartyDto) {
    const getParty = await this.getPartyById(updateParty.id);

    if (getParty.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
    }

    if (getParty[0].name !== updateParty.name.toLowerCase()) {
      const existingParty = await this.getPartyByName(updateParty.name.toLowerCase());

      if (existingParty.length > 0) {
        return new HttpException({ message: ["Cette catégorie existe déjà."] }, HttpStatus.BAD_REQUEST);
      }
    }

    const { error } = await this.supabaseService.client
      .from('party')
      .update([{ name: updateParty.name.toLowerCase() }])
      .eq('id', updateParty.id);

    return { statusCode: 200, message: "Updated" }
  }

  async deleteParty(id: string) {
    const getParty = await this.getPartyById(id);

    if (getParty.length == 0) {
      return new HttpException({ message: ["L'évènement n'existe pas."] }, HttpStatus.NOT_FOUND);
    }


    const { data, error } = await this.supabaseService.client
      .from('party')
      .delete()
      .eq('id', id);

    return { statusCode: 204, message: "Deleted" }
  }

}
