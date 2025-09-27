import { Request, Response } from 'express'; 
import { LocationsService } from '../services/LocationsService'; 
import { CreateLocationDto } from '../models/locationDtos'; 

export class LocationsController{ 
  constructor(private service=new LocationsService()){} 
  
  list=async(_req:Request,res:Response)=>{
    res.json(await this.service.list())
  };
  
  create=async(req:Request,res:Response)=>{ 
    const parsed=CreateLocationDto.safeParse(req.body); 
    if(!parsed.success) 
      return res.status(400).json({errors:parsed.error.flatten()}); 
    
    const created = await this.service.create(parsed.data); 
    res.status(201).json(created); 
  }
}
