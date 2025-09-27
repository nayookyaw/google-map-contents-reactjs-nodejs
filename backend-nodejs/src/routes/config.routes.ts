import { Router } from 'express'; 
import { ConfigController } from '../controllers/ConfigController'; 

const router=Router(); 
const controller=new ConfigController(); 

router.get('/google-maps-key', controller.getGoogleMapsKey); 

export default router;
