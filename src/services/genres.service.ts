import { IVariables } from './../interfaces/variable.interface';
import { findOneElement, assignDocumentId } from './../lib/db-operations';
import { COLLECTIONS } from './../config/constants';
import { IContextData } from './../interfaces/context-data.interface';
import ResolversOperationsService from './resolvers-operations.service';
import slugify from 'slugify';

class GenresService extends ResolversOperationsService {
    collection = COLLECTIONS.GENRES;
    constructor(root: object, variables: object, context: IContextData) {
        super(root, variables, context);
    }
    
    async items() {
        const page = this.getVariables().pagination?.page;
        const itemsPage = this.getVariables().pagination?.itemsPage;
        console.log(this.getVariables().pagination);       
        console.log(page, itemsPage);
        const result = await this.list(this.collection, 'genres', page, itemsPage);
        return {info: result.info, status: result.status, message: result.message, genres: result.items };
    }

    async details() {
        const idNumber = this.getVariables().id as number;
        const id = { id: parseInt(idNumber.toString())};
        const result = await this.get(this.collection, id);
        return { status: result.status, message: result.message, genre: result.item};
    }

    async insert() {
        const genre = this.getVariables().genre;
        const id = this.getVariables().id;

        if(!this.checkData(genre || '')) {
            return {
                status: false,
                message: 'Gender not specified',
                genre: null
            };
        }

        if(await this.checkInDataBase(genre || '' )) {
            return {
                status: false,
                message: 'Gender duplicated, try again',
                genre: null
            };
        }

        const genreObject = {
            id: await assignDocumentId(this.getDb(), this.collection,  { id: -1}),
            name: genre,
            slug: slugify(genre || '', {lower: true})
        };
        const result = await this.add(this.collection, genreObject, 'genre');
        return { status: result.status, message: result.message, genre: result.item};
    }

    async modify() {
        const genre = this.getVariables().genre;
        const idNumber = this.getVariables().id as number;
        const id = { id: parseInt(idNumber.toString())};
        
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'ID genre not specified',
                genre: null
            };
        }

        if (!this.checkData(genre || '')) {
            return {
                status: false,
                message: 'genre not specified',
                genre: null
            };
        }

        const objectUpdate = { 
            name: genre,
            slug: slugify( genre || '', {lower: true})
        };
        const result = await this.update(this.collection, id, objectUpdate, 'genre');
        return { status: result.status, message: result.message, genre: result.item };
    }

    async delete() {
        const idNumber = this.getVariables().id as number;
        const id = { id: parseInt(idNumber.toString())};
        
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'ID genre not specified',
                genre: null
            };
        }

        const result = await this.del(this.collection, id, 'genre');
        return { status: result.status, message: result.message };
    }

    async block() {
        const idNumber = this.getVariables().id as number;
        const id = { id: parseInt(idNumber.toString())};
        
        if (!this.checkData(String(id) || '')) {
            return {
                status: false,
                message: 'ID genre not specified',
                genre: null
            };
        }

        const result = await this.update(this.collection, id, {active: false}, 'genre');
        return { 
            status: result.status, 
            message: result.message ? 'Has been successfully blocked' : 'It has not been blocked, check it'
        };
    }

    private checkData(value: string) {
        return (value === '' || value === undefined) ? false : true;
    }

    private async checkInDataBase(value: string) {
        return await findOneElement(this.getDb(), this.collection, {
            name: value
        });
    }

}

export default GenresService;