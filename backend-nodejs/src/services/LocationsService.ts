import { LocationsRepository } from '../repositories/LocationsRepository'; 
import { CreateLocationDto, UpdateLocationDto} from '../models/locationDtos'; 

export class LocationsService{ 
  constructor(private repo=new LocationsRepository()){} 
  
  list(){return this.repo.list()} 
  
  create(input:CreateLocationDto){return this.repo.create(input)}

  update(id: number, input: UpdateLocationDto) {
    return this.repo.update(id, input);
  }

  remove(id: number) {
    return this.repo.remove(id);
  }
}
