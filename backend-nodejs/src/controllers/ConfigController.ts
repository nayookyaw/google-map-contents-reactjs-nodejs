import { Request, Response } from 'express'; 
import { prisma } from '../config/db'; 

export class ConfigController{ 
  getGoogleMapsKey = async (_req:Request,res:Response)=>{ 
    const cfg = await prisma.appConfig.findUnique({where:{id:1}});
    if(!cfg) return res.status(500).json({error:'AppConfig not initialized'}); 
    res.json({apiKey: cfg.googleMapsApiKey}); 
  }
}
