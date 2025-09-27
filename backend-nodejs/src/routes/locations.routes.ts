import { Router } from 'express'; 
import { LocationsController } from '../controllers/LocationsController'; 

const router=Router(); 
const controller=new LocationsController(); 

router.get('/', controller.list); 
router.post('/', controller.create); 
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

export default router;
