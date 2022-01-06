import { getConnection, getRepository } from 'typeorm';
import { CARD_NOT_FOUND, LIST_NOT_FOUND } from '../constants/message';
import Card from '../entities/card';
import List from '../entities/list';

/**
 * Save a new card
 *
 * @param {string} text
 * @param {number} listId
 * @returns saved card
 */
export const createCard = async (text, listId, next) => {
  const list = await getRepository(List).findOne(listId);
  if (!list) {
    next(new Error(LIST_NOT_FOUND + listId));
  }

  const saveObject = { text, list };

  const cardWithLastIndex = await getRepository(Card).findOne({ where: { listId }, order: { index: 'DESC' } });

  saveObject.index = cardWithLastIndex ? cardWithLastIndex.index + 1 : 0;

  return await getRepository(Card).save(saveObject);
};

/**
 * Update a card
 *
 * @param {number} cardId
 * @param {object} requestBody that contains listId, index
 * @returns updated card
 */
export const updateCard = async (cardId, requestBody, next) => {
  const { listId: destListId, index: newIndex, text } = requestBody;
  const card = await getRepository(Card).findOne(cardId);

  if (!card) {
    next(new Error(CARD_NOT_FOUND + cardId));
  }

  const originIndex = card.index;
  const originListId = card.listId;

  let destList;

  if (destListId) {
    destList = await getRepository(List).findOne(destListId);
    if (!destList) {
      next(new Error(LIST_NOT_FOUND + destListId));
    }

    // same position as before
    if (destListId === originListId && newIndex === originIndex) {
      return card;
    }
  }

  await getConnection().transaction(async transactionalEntityManager => {
    const updateObject = { index: newIndex };
    if (text) updateObject.text = text;

    await transactionalEntityManager
      .createQueryBuilder()
      .update(Card)
      .set({ index: null })
      .where('listId = :originListId AND id = :id', { originListId, id: cardId })
      .execute();

    // when moving to another list
    if (destListId) {
      updateObject.listId = destListId;

      //update indecies of the origin list
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Card)
        .set({ index: () => 'index - 1' })
        .where('listId = :originListId AND index > :indexToRemove', {
          originListId,
          indexToRemove: originIndex
        })
        .execute();

      //update indecies of the dest list
      await transactionalEntityManager
        .createQueryBuilder()
        .update(Card)
        .set({ index: () => 'index + 1' })
        .where('listId = :destListId AND index >= :newIndex', {
          destListId,
          newIndex
        })
        .execute();

      // when moving inside of the list
    } else {
      if (originIndex < newIndex) {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Card)
          .set({ index: () => 'index - 1' })
          .where('listId = :originListId AND index > :originIndex AND index <= :newIndex', {
            originListId,
            originIndex,
            newIndex
          })
          .execute();
      } else {
        await transactionalEntityManager
          .createQueryBuilder()
          .update(Card)
          .set({ index: () => 'index + 1' })
          .where('listId = :originListId AND index < :originIndex AND index >= :newIndex', {
            originListId,
            originIndex,
            newIndex
          })
          .execute();
      }
    }

    await transactionalEntityManager.getRepository(Card).update(cardId, updateObject);
  });

  return await getCardById(cardId, next);
};

/**
 * Get a card by cardId
 *
 * @param {number} cardId
 * @returns card
 */
export const getCardById = async (cardId, next) => {
  const card = await getRepository(Card).findOne(cardId, { relations: ['list'] });

  if (!card) {
    next(new Error(CARD_NOT_FOUND + cardId));
  }

  return card;
};

/**
 * Delete a card by cardId
 *
 * @param {number} cardId
 */
export const deleteCard = async (cardId, next) => {
  const card = await getRepository(Card).findOne(cardId);

  if (!card) {
    next(new Error(CARD_NOT_FOUND + cardId));
  }

  await getConnection().transaction(async transactionalEntityManager => {
    const indexToRemove = card.index;

    await transactionalEntityManager.getRepository(Card).delete(cardId);

    await transactionalEntityManager
      .createQueryBuilder()
      .update(Card)
      .set({ index: () => 'index - 1' })
      .where('listId = :listId AND index > :indexToRemove', { listId: card.listId, indexToRemove })
      .execute();
  });
};
