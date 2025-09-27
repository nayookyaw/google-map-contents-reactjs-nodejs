import { prisma } from '../config/db'; 
import { Location } from '@prisma/client'; 
import { CreateLocationDto } from '../models/dtos'; 

export class LocationsRepository{ 
  async list():Promise<Location[]>{ 
    return prisma.location.findMany({orderBy:{id:'desc'}});
  } 
  
  async create(input:CreateLocationDto){ 
    return prisma.location.create({data:input});
  }
}
