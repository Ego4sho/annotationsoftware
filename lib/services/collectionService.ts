import { db } from '@/lib/firebase';
import { Collection } from '@/types/upload';
import { addDoc, updateDoc, doc, getDocs, query, where, Timestamp, collection as firestoreCollection, getDoc, setDoc } from 'firebase/firestore';

const COLLECTIONS_COLLECTION = 'collections';

type CollectionData = Omit<Collection, 'id'> & { [key: string]: any };

export const collectionService = {
  async createCollection(collection: Collection) {
    try {
      // Create a new collection without the id field
      const { id, ...collectionWithoutId } = collection;
      
      const collectionData: CollectionData = {
        ...collectionWithoutId,
        createdAt: collection.createdAt || Timestamp.now(),
        updatedAt: Timestamp.now(),
        deleted: false,
        status: collection.status || 'incomplete',
        files: {
          video: collection.files?.video || [],
          audio: collection.files?.audio || [],
          motion: collection.files?.motion || [],
          aux1: collection.files?.aux1 || [],
          aux2: collection.files?.aux2 || [],
          aux3: collection.files?.aux3 || [],
          aux4: collection.files?.aux4 || [],
          aux5: collection.files?.aux5 || []
        },
        progress: collection.progress || {
          labeling: 'not-started',
          rating: 'not-started',
          validated: 'not-started'
        }
      };

      // Remove any undefined fields
      Object.keys(collectionData).forEach(key => {
        if (collectionData[key] === undefined) {
          delete collectionData[key];
        }
      });

      console.log('Creating collection with data:', collectionData);
      
      // If an ID was provided, use it
      let docRef;
      if (id) {
        docRef = doc(db, COLLECTIONS_COLLECTION, id);
        await setDoc(docRef, collectionData);
      } else {
        docRef = await addDoc(firestoreCollection(db, COLLECTIONS_COLLECTION), collectionData);
      }
      
      console.log('Collection created with ID:', docRef.id);
      
      // Return the collection with the Firebase-generated ID
      const newCollection = { ...collectionData, id: docRef.id } as Collection;
      console.log('Returning new collection:', newCollection);
      return newCollection;
    } catch (error) {
      console.error('Error creating collection:', error);
      throw error;
    }
  },

  async updateCollection(collection: Collection) {
    try {
      if (!collection.id) {
        throw new Error('Collection ID is required for updates');
      }
      const docRef = doc(db, COLLECTIONS_COLLECTION, collection.id);
      
      // First check if the document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        // If document doesn't exist, create it
        return await this.createCollection(collection);
      }
      if (docSnap.data()?.deleted) {
        throw new Error('Cannot update a deleted collection');
      }

      // Update the collection
      const { id, ...collectionWithoutId } = collection;
      await updateDoc(docRef, {
        ...collectionWithoutId,
        updatedAt: Timestamp.now()
      });
      return collection;
    } catch (error) {
      console.error('Error updating collection:', error);
      throw error;
    }
  },

  async deleteCollection(collectionId: string) {
    try {
      console.log('Starting collection deletion:', collectionId);
      const docRef = doc(db, COLLECTIONS_COLLECTION, collectionId);
      
      // First check if the document exists
      const docSnap = await getDoc(docRef);
      if (!docSnap.exists()) {
        console.log('Collection not found in Firestore:', collectionId);
        // Return true to indicate the collection should be removed from UI
        return true;
      }

      // Delete the collection by setting deleted flag and clearing any project association
      const updateData = {
        deleted: true,
        updatedAt: Timestamp.now(),
        projectId: null // Remove from any project
      };
      console.log('Updating collection with data:', updateData);
      await updateDoc(docRef, updateData);
      console.log('Collection marked as deleted:', collectionId);
      return true;
    } catch (error) {
      console.error('Error deleting collection:', error);
      throw error;
    }
  }
}; 