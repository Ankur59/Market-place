import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-expo";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  setDoc,
} from "firebase/firestore";
import { app, db } from "../firebaseconfig";

export default function SyncUserToFirestore() {
  const { user, isLoaded } = useUser();
  const db = getFirestore(app);
  const [userdata, setuserdata] = useState();

  useEffect(() => {
    const sync = async () => {
      if (!isLoaded || !user) {
        console.log("returned");
        return;
      }

      const userId = user.id.toString();
      try {
        const userRef = doc(db, "users", userId);

        const docSnap = await getDoc(userRef);

        if (!docSnap.exists()) {
          await setDoc(userRef, {
            name: user.fullName,
            email: user.primaryEmailAddress.emailAddress,
            role: "user",
          });
        }
      } catch (error) {
        console.error("❌ Error in Firestore access:", error);
      }
    };

    sync();

  }, [user, isLoaded]);

  return null; // ✅ This component only runs logic; doesn't render anything
}
