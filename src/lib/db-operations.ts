import { IPaginationOptions } from "./../interfaces/pagination-options.interface";
import { Db } from "mongodb";
/**
 * Obtener el ID que va a tener el nuevo usuario
 * @param database Base de datos donde se esta trabajando
 * @param collection colleción donde busca el último elemento
 * @param sort Como se quiere ordenar { <propiedad>: -1}
 */

export const assignDocumentId = async (
  database: Db,
  collection: string,
  sort: object = { registerDate: -1 }
) => {
  //Comprobar ultimo usuario registrado para asignar ID
  const lastElement = await database
    .collection(collection)
    .find()
    .limit(1)
    .sort(sort)
    .toArray();
  if (lastElement.length === 0) {
    return 1;
  }
  return lastElement[0].id + 1;
};

export const findOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return database.collection(collection).findOne(filter);
};

export const insertOneElement = async (
  database: Db,
  collection: string,
  document: object
) => {
  return await database.collection(collection).insertOne(document);
};

export const insertManyElements = async (
  database: Db,
  collection: string,
  documents: Array<object>
) => {
  return await database.collection(collection).insertMany(documents);
};

export const findElements = async (
  database: Db,
  collection: string,
  filter: object = {},
  paginationOptions: IPaginationOptions = {
    page: 1,
    pages: 1,
    itemsPage: -1,
    skip: 0,
    total: -1,
  }
) => {
  if (paginationOptions.total === -1) {
    return await database.collection(collection).find(filter).toArray();
  }
  return await database
    .collection(collection)
    .find(filter)
    .limit(paginationOptions.itemsPage)
    .skip(paginationOptions.skip)
    .toArray();
};

export const updateOneElement = async (
  database: Db,
  collection: string,
  filter: object,
  updateObject: object
) => {
  return await database
    .collection(collection)
    .updateOne(filter, { $set: updateObject });
};

export const deleteOneElement = async (
  database: Db,
  collection: string,
  filter: object
) => {
  return await database.collection(collection).deleteOne(filter);
};

export const countElements = async (
  database: Db,
  collection: string,
  filter: object = {}
) => {
  return await database.collection(collection).countDocuments(filter);
};
