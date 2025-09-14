import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  getDoc, 
  updateDoc, 
  deleteDoc, 
  setDoc,
  query, 
  where, 
  orderBy, 
  limit 
} from 'firebase/firestore'
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject 
} from 'firebase/storage'
import { db, storage } from './firebase'

// Analytics helper
export const logEvent = (eventName: string, parameters?: any) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters)
  }
}

// Firestore operations
export const addDocument = async (collectionName: string, data: any) => {
  try {
    const docRef = await addDoc(collection(db, collectionName), {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date()
    })
    return docRef.id
  } catch (error) {
    console.error('Error adding document:', error)
    throw error
  }
}

export const getDocument = async (collectionName: string, docId: string) => {
  try {
    const docRef = doc(db, collectionName, docId)
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      throw new Error('Document not found')
    }
  } catch (error) {
    console.error('Error getting document:', error)
    throw error
  }
}

export const getDocuments = async (collectionName: string, constraints?: any[]) => {
  try {
    let q = collection(db, collectionName)
    
    if (constraints) {
      q = query(q, ...constraints)
    }
    
    const querySnapshot = await getDocs(q)
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }))
  } catch (error) {
    console.error('Error getting documents:', error)
    throw error
  }
}

export const updateDocument = async (collectionName: string, docId: string, data: any) => {
  try {
    const docRef = doc(db, collectionName, docId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: new Date()
    })
  } catch (error) {
    console.error('Error updating document:', error)
    throw error
  }
}

export const deleteDocument = async (collectionName: string, docId: string) => {
  try {
    await deleteDoc(doc(db, collectionName, docId))
  } catch (error) {
    console.error('Error deleting document:', error)
    throw error
  }
}

// Storage operations
export const uploadFile = async (file: File, path: string) => {
  try {
    const storageRef = ref(storage, path)
    const snapshot = await uploadBytes(storageRef, file)
    const downloadURL = await getDownloadURL(snapshot.ref)
    return downloadURL
  } catch (error) {
    console.error('Error uploading file:', error)
    throw error
  }
}

export const deleteFile = async (path: string) => {
  try {
    const fileRef = ref(storage, path)
    await deleteObject(fileRef)
  } catch (error) {
    console.error('Error deleting file:', error)
    throw error
  }
}

// Product-specific functions
export const getProducts = async () => {
  return getDocuments('products', [orderBy('createdAt', 'desc')])
}

export const getProduct = async (productId: string) => {
  return getDocument('products', productId)
}

export const addProduct = async (productData: any) => {
  return addDocument('products', productData)
}

export const updateProduct = async (productId: string, productData: any) => {
  return updateDocument('products', productId, productData)
}

export const deleteProduct = async (productId: string) => {
  return deleteDocument('products', productId)
}

// User-specific functions
export const getUserProfile = async (userId: string) => {
  return getDocument('users', userId)
}

export const updateUserProfile = async (userId: string, profileData: any) => {
  return updateDocument('users', userId, profileData)
}

// Order functions
export const createOrder = async (orderData: any) => {
  return addDocument('orders', orderData)
}

export const getUserOrders = async (userId: string) => {
  return getDocuments('orders', [
    where('userId', '==', userId),
    orderBy('createdAt', 'desc')
  ])
}

// Content management functions
export const getAboutContent = async () => {
  try {
    const docRef = doc(db, 'content', 'about')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      // Return default content if document doesn't exist
      return {
        heroTitle: "ABOUT LEGACY",
        heroDescription: "WE ARE PIONEERS IN THE FUSION OF FASHION AND TECHNOLOGY, CREATING UNPRECEDENTED SHOPPING EXPERIENCES THAT BRIDGE THE GAP BETWEEN DIGITAL AND PHYSICAL REALITY.",
        storyTitle: "OUR STORY",
        storyContent: [
          "Founded in 2010, LEGACY emerged from a simple yet revolutionary idea: what if technology could make fashion more personal, more accessible, and more exciting than ever before?",
          "We started as a small team of fashion enthusiasts and tech innovators, united by a shared vision of transforming how people discover, try on, and experience clothing in the digital age.",
          "Today, we're proud to be at the forefront of AI-powered fashion technology, serving millions of customers worldwide with our innovative try-on experiences and premium product offerings."
        ],
        missionTitle: "OUR MISSION",
        missionContent: "TO DEMOCRATIZE FASHION BY MAKING IT MORE ACCESSIBLE, PERSONAL, AND SUSTAINABLE THROUGH INNOVATIVE TECHNOLOGY, WHILE MAINTAINING THE HIGHEST STANDARDS OF QUALITY AND CUSTOMER EXPERIENCE."
      }
    }
    return null
  } catch (error) {
    console.error('Error fetching about content:', error)
    return null
  }
}

export const getCompanyRules = async (): Promise<string[]> => {
  try {
    const docRef = doc(db, 'settings', 'companyRules')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return data.rules || []
    }
    return []
  } catch (error) {
    console.error('Error getting company rules:', error)
    throw error
  }
}

export const saveAboutContent = async (aboutData: any) => {
  try {
    const docRef = doc(db, 'content', 'about')
    // Try to update first
    try {
      await updateDoc(docRef, {
        ...aboutData,
        updatedAt: new Date()
      })
    } catch (updateError) {
      // If document doesn't exist, create it using setDoc
      await setDoc(docRef, {
        ...aboutData,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error saving about content:', error)
    throw error
  }
}

export const saveCompanyRules = async (rules: string[]) => {
  try {
    const docRef = doc(db, 'settings', 'companyRules')
    // Try to update first
    try {
      await updateDoc(docRef, {
        rules,
        updatedAt: new Date()
      })
    } catch (updateError) {
      // If document doesn't exist, create it using setDoc
      await setDoc(docRef, {
        rules,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error saving company rules:', error)
    throw error
  }
}

// Social Media functions
export const getSocialMediaUrls = async () => {
  try {
    const docRef = doc(db, 'settings', 'socialMedia')
    const docSnap = await getDoc(docRef)
    
    if (docSnap.exists()) {
      const data = docSnap.data()
      return {
        instagram: data.instagram || "https://instagram.com/legacy",
        tiktok: data.tiktok || "https://tiktok.com/@legacy",
        youtube: data.youtube || "https://youtube.com/@legacy"
      }
    } else {
      // Return default URLs if document doesn't exist
      return {
        instagram: "https://instagram.com/legacy",
        tiktok: "https://tiktok.com/@legacy", 
        youtube: "https://youtube.com/@legacy"
      }
    }
  } catch (error) {
    console.error('Error getting social media URLs:', error)
    // Return defaults on error
    return {
      instagram: "https://instagram.com/legacy",
      tiktok: "https://tiktok.com/@legacy",
      youtube: "https://youtube.com/@legacy"
    }
  }
}

export const saveSocialMediaUrls = async (socialMediaUrls: {instagram: string, tiktok: string, youtube: string}) => {
  try {
    const docRef = doc(db, 'settings', 'socialMedia')
    // Try to update first
    try {
      await updateDoc(docRef, {
        ...socialMediaUrls,
        updatedAt: new Date()
      })
    } catch (updateError) {
      // If document doesn't exist, create it using setDoc
      await setDoc(docRef, {
        ...socialMediaUrls,
        createdAt: new Date(),
        updatedAt: new Date()
      })
    }
  } catch (error) {
    console.error('Error saving social media URLs:', error)
    throw error
  }
}
