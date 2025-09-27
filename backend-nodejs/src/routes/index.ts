import { Router } from 'express'; 

import configRoutes from './config.routes'; 
import locationsRoutes from './locations.routes'; 
import usersRoutes from './users.routes'; 

const router=Router(); 
router.use('/config', configRoutes); 
router.use('/locations', locationsRoutes); 
router.use('/users', usersRoutes); 

export default router;
