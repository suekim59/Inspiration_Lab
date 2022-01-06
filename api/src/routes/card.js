import { Router } from "express";
import * as CardController from "../controllers/card";

const router = Router();

router.get("/:id",CardController.getCardById);

router.post("/",CardController.createCard);

router.patch("/:id",CardController.updateCard);

router.delete("/:id",CardController.deleteCard);

export default router;
