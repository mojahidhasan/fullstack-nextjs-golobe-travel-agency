import "server-only";
import { initializeApp } from "@firebase/app";
import {
  getStorage,
  ref,
  getDownloadURL,
  uploadString,
} from "@firebase/storage";
import {
  getAuth,
  signInWithEmailAndPassword,
  setPersistence,
  inMemoryPersistence,
} from "@firebase/auth";
import { randomBytes } from "node:crypto";

const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: process.env.FIREBASE_AUTH_DOMAIN,
  projectId: process.env.FIREBASE_PROJECT_ID,
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.FIREBASE_APP_ID,
  measurementId: process.env.FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);

async function firebaseAuthLogin() {
  await setPersistence(auth, inMemoryPersistence).then(() => {
    return signInWithEmailAndPassword(
      auth,
      process.env.FIREBASE_AUTH_EMAIL,
      process.env.FIREBASE_AUTH_PASSWORD
    );
  });
}

const storage = getStorage(app);

async function uploadPhoto(bucketFolderPath, base64ImageData) {
  await firebaseAuthLogin();
  const random1 = randomBytes(8).toString("hex");
  const random2 = randomBytes(8).toString("hex");
  const currentTime = new Date().getTime().toString("16");

  const fileName = random1 + random2 + currentTime;

  const pictureRef = ref(storage, `${bucketFolderPath}/${fileName}.jpg`);

  try {
    const snapshot = await uploadString(
      pictureRef,
      base64ImageData,
      "data_url"
    );
    return { fileName: snapshot.metadata.name, path: bucketFolderPath };
  } catch (error) {
    console.log(error);
    throw error;
  }
}

async function getBucketPhotoUrl(fileFullName, folderName) {
  await firebaseAuthLogin();
  const profilePictureRef = ref(storage, folderName + "/" + fileFullName);
  try {
    return await getDownloadURL(profilePictureRef);
  } catch (error) {
    throw error;
  }
}
export { getBucketPhotoUrl, uploadPhoto };
