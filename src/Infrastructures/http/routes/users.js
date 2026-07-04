import { Router } from "express";
import usersHandler from "../handlers/UsersHandler.js";

const router = Router();

router.post('', usersHandler.postUser);
router.get('/:id', usersHandler.getUserById);
router.put('/:id', usersHandler.updateFullname);
router.delete('/:id', usersHandler.deleteUser);

export default router;