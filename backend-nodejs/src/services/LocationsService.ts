import { LocationsRepository } from '../repositories/LocationsRepository'; 
import { CreateLocationDto } from '../models/locationDtos'; 

export class LocationsService{ 
  constructor(private repo=new LocationsRepository()){} 
  
  list(){return this.repo.list()} 
  
  create(input:CreateLocationDto){return this.repo.create(input)} }
