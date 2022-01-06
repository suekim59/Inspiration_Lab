import * as CardService from '../services/card';

export const createCard = async (req, res, next) => {
  return res.created(await CardService.createCard(req.body.text, req.body.listId, next));
};

export const updateCard = async (req, res, next) => {
  return res.ok(await CardService.updateCard(+req.params.id, req.body, next));
};

export const getCardById = async (req, res, next) => {
  return res.ok(await CardService.getCardById(+req.params.id, next));
};

export const deleteCard = async (req, res, next) => {
  await CardService.deleteCard(+req.params.id, next);
  return res.noContent();
};
