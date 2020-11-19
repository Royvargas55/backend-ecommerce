import { IContextData } from "./../interfaces/context-data.interface";
import { Db } from "mongodb";
import {
  findOneElement,
  insertOneElement,
  findElements,
  updateOneElement,
  deleteOneElement,
} from "./../lib/db-operations";
import { IVariables } from "../interfaces/variable.interface";
import { pagination } from "../lib/pagination";

class ResolversOperationsService {
  private root: object;
  private variables: IVariables;
  private context: IContextData;
  constructor(root: object, variables: IVariables, context: IContextData) {
    this.root = root;
    this.variables = variables;
    this.context = context;
  }
  //getters
  protected getDb(): Db {
    return this.context.db!;
  }
  protected getVariables(): IVariables {
    return this.variables;
  }
  protected getContext(): IContextData {
    return this.context;
  }
  //List data
  protected async list(
    collection: string,
    listElements: string,
    page: number = 1,
    itemsPage: number = 20,
    filter: object = { active: { $ne: false}}
  ) {
    try {
      const paginationData = await pagination(
        this.getDb(),
        collection,
        page,
        itemsPage,
        filter
      );
      return {
        info: {
          page: paginationData.page,
          pages: paginationData.pages,
          itemsPage: paginationData.itemsPage,
          total: paginationData.total,
        },
        status: true,
        message: `List of ${listElements} loaded`,
        items: await findElements(this.getDb(), collection, filter, paginationData),
      };
    } catch (error) {
      return {
        info: null,
        status: false,
        message: `List of ${listElements} doesnt loaded: ${error}`,
        items: null,
      };
    }
  }
  // Get details
  protected async get(collection: string, id: {}) {
    // Response ok
    // Find data
    // No data found
    // Error
    // status: false
    const collectionLabel = collection.toLowerCase();
    try {
      return await findOneElement(this.getDb(), collection, id).then(
        (result) => {
          if (result) {
            return {
              status: true,
              message: `${collectionLabel} collection loaded successfully`,
              item: result,
            };
          }
          return {
            status: true,
            message: `${collectionLabel} collection has no information`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error loading collection details ${collectionLabel}`,
        item: null,
      };
    }
  }
  // Add item
  protected async add(collection: string, document: object, item: string) {
    try {
      return await insertOneElement(this.getDb(), collection, document).then(
        (res) => {
          if (res.result.ok) {
            return {
              status: true,
              message: `Item has been inserted: ${item}`,
              item: document,
            };
          }
          return {
            status: false,
            message: `Item has not been inserted: ${item}`,
            item: null,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error adding item ${item}, ${error}`,
        item: null,
      };
    }
  }
  // Modify item
  protected async update(
    collection: string,
    filter: object,
    objectUpdate: object,
    item: string
  ) {
    try {
      return await updateOneElement(
        this.getDb(),
        collection,
        filter,
        objectUpdate
      ).then((res) => {
        if (res.result.nModified === 1 && res.result.ok) {
          return {
            status: true,
            message: `Item has been modified: ${item} `,
            item: Object.assign({}, filter, objectUpdate),
          };
        }
        return {
          status: false,
          message: `Item has not been modified: ${item}`,
          item: null,
        };
      });
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error ${item}. try again`,
        item: null,
      };
    }
  }
  // Delete item
  protected async del(collection: string, filter: object, item: string) {
    try {
      return await deleteOneElement(this.getDb(), collection, filter).then(
        (res) => {
          if (res.deletedCount === 1) {
            return {
              status: true,
              message: `Item has been deleted: ${item} `,
            };
          }
          return {
            status: false,
            message: `Item has not been deleted: ${item} `,
          };
        }
      );
    } catch (error) {
      return {
        status: false,
        message: `Unexpected error ${item}. try again`,
        item: null,
      };
    }
  }
}

export default ResolversOperationsService;
