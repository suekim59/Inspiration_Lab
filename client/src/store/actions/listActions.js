import {
    CONSTANTS
} from '../actions'
import axios from 'axios'

const API_URL = "http://localhost:3001"

/**
 * Add a list
 * @param {string} title 
 * @returns 
 */

export const addList = (title) => {
   /**
     * TODO 1. 
     * Complete addList function 
     * 1. Use backend endpoint to create a list
     * 2. Get the response of the db, dispatch the relevant type with newly created data
     */
    /////////////////////////////////////////////////////////////////////
    return async (dispatch) => {
      
    };
    /////////////////////////////////////////////////////////////////////
};

/**
 * Delete a list
 * @param {string} listId 
 * @returns 
 */
export const deleteList = (listId) => {
   /**
     * TODO 2. 
     * Complete deleteList function 
     * 1. Use backend endpoint to delete a list
     * 2. Get the response of the db (status) and if the status is 204, dispatch the relevant type  
     */
    /////////////////////////////////////////////////////////////////////
    return async (dispatch) => {
       
    }
    /////////////////////////////////////////////////////////////////////
}

/**
 * fetch lists from db
 * @returns 
 */
export const fetchLists = () => {
    return async (dispatch) => {
        const response = await axios.get(`${API_URL}/list/`)
        console.log("fetch list works..")
        dispatch({
            type: CONSTANTS.SET_LIST,
            payload: {lists : response.data}
        })
    }
}

/**
 * Update index of the list upon the result of the drag and drop
 * @param {string} droppableIdStart // origin drppableId
 * @param {string} droppableIdEnd   // destination drppableId
 * @param {number} droppableIndexStart //origin index
 * @param {number} droppableIndexEnd // destination index
 * @param {string} draggableId // id of the dragged object
 * @param {string} type //Either list or DEFAULT
 * @returns 
 */
export const UpdateListIndex  = (droppableIdStart, droppableIdEnd, droppableIndexStart, droppableIndexEnd, draggableId, type) => {
      /**
     * TODO 3. 
     * Complete UpdateListIndex function 
     * 1. Dispatch the relevant type 
     * 2. Use backend endpoint to update lists upon drag and drop
     */
    /////////////////////////////////////////////////////////////////////
    
}
