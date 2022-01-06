import { getConnection, getRepository, SimpleConsoleLogger } from 'typeorm';
import List from '../entities/list';
/**
 * Get all lists with cards assigned
 *
 * @returns all lists
 */
export const getAllList = async () => {
  return await getRepository(List).find({ relations: ['cards'] });
};

/**
 * Get a list by listId with cards assigned
 *
 * @param  {number} listId
 * @returns a list
 */
export const getListById = async (listId, next) => {
  try {
    return await getRepository(List).findOneOrFail(listId, { relations: ['cards'] });
  } catch (error) {
    next(new Error(error));
  }
};

/**
 * Create a new list
 *
 * @param {string} title
 * @returns created list
 */
export const createList = async title => {
  const saveObject = { title };
  const listWithLastIndex = await getRepository(List).findOne({ order: { index: 'DESC' } });

  saveObject.index = listWithLastIndex ? listWithLastIndex.index + 1 : 0;

  return await getRepository(List).save(saveObject);
};

/**
 * Update a list
 *
 * @param listId
 * @param {object} requestBody that contains index to update
 * @returns updated list
 */
export const updateList = async (listId, requestBody, next) => {
  const { index: newIndex } = requestBody;

  let list;
  try {
    list = await getRepository(List).findOneOrFail(listId);
  } catch (error) {
    next(new Error(error));
  }

  if (newIndex === list.index) return list;

  await getConnection().transaction(async transactionalEntityManager => {
    const originIndex = list.index;

    await transactionalEntityManager
      .createQueryBuilder()
      .update(List)
      .set({ index: null })
      .where('id = :id', { id: listId })
      .execute();

    if (originIndex < newIndex) {
      await transactionalEntityManager
        .createQueryBuilder()
        .update(List)
        .set({ index: () => 'index - 1' })
        .where('index > :originIndex AND index <= :newIndex', { originIndex, newIndex })
        .execute();
    } else {
      await transactionalEntityManager
        .createQueryBuilder()
        .update(List)
        .set({ index: () => 'index + 1' })
        .where('index < :originIndex AND index >= :newIndex', { originIndex, newIndex })
        .execute();
    }

    await transactionalEntityManager.getRepository(List).update(listId, { index: newIndex });
  });

  return await getListById(listId, next);
};

/**
 * Delete a list
 *
 * @param listId listId
 */
export const deleteList = async (listId, next) => {
  let list;
  try {
    list = await getRepository(List).findOneOrFail(listId);
  } catch (error) {
    next(new Error(error));
  }

  await getConnection().transaction(async transactionalEntityManager => {
    const indexToRemove = list.index;

    await transactionalEntityManager.getRepository(List).delete(listId);

    await transactionalEntityManager
      .createQueryBuilder()
      .update(List)
      .set({ index: () => 'index - 1' })
      .where('index > :indexToRemove', { indexToRemove })
      .execute();
  });
};
