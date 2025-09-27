import { Request, Response } from 'express'; 
import { LocationsService } from '../services/LocationsService'; 
import { CreateLocationDto, UpdateLocationDto } from '../models/locationDtos'; 

export class LocationsController{ 
  constructor(private service=new LocationsService()){} 
  
  list=async(_req:Request,res:Response)=>{
    const locationList = await this.service.list();
    res.status(200).json(locationList)
  };
  
  create=async(req:Request,res:Response)=>{ 
    const parsed=CreateLocationDto.safeParse(req.body); 
    if(!parsed.success) 
      return res.status(400).json({errors:parsed.error.flatten()}); 
    
    const createdLocation = await this.service.create(parsed.data); 
    res.status(201).json(createdLocation); 
  }

  update = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid id' });

    const parsed = UpdateLocationDto.safeParse(req.body);
    if (!parsed.success)
      return res.status(400).json({ errors: parsed.error.flatten() });

    const updated = await this.service.update(id, parsed.data);
    res.status(200).json(updated);
  };

  remove = async (req: Request, res: Response) => {
    const id = Number(req.params.id);
    if (Number.isNaN(id) || id <= 0)
      return res.status(400).json({ error: 'Invalid id' });

    const deleted = await this.service.remove(id);
    res.status(200).json({ ok: true, id: deleted.id });
  };
}
