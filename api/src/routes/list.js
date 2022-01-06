import { Router } from 'express';
import * as ListController from '../controllers/list';

const router = Router();

// get all list with tasks assgined
router.get('/', ListController.getAllList);

router.get('/:id', ListController.getListById);

router.post('/', ListController.createList);

router.patch('/:id', ListController.updateList);

router.delete('/:id', ListController.deleteList);

export default router;
