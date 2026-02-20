import { auth, db } from "./firebase.js";
import { signInAnonymously, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js";
import { collection, onSnapshot } from "https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js";
import { renderApps, renderProducts, renderSocials } from "./render.js";

let dataLoaded = false;

export const loadData = () => {
    if (dataLoaded) return;
    dataLoaded = true;

    onSnapshot(collection(db, 'apps'), snapshot => {
        renderApps(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    }, err => console.error("Error loading Apps:", err));

    onSnapshot(collection(db, 'products'), snapshot => {
        renderProducts(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    }, err => console.error("Error loading Products:", err));

    onSnapshot(collection(db, 'profiles'), snapshot => {
        renderSocials(snapshot.docs.map(doc => ({id: doc.id, ...doc.data()})));
    }, err => console.error("Error loading Socials:", err));
};

export const initAuth = async () => {
    try {
        await signInAnonymously(auth);
        loadData();
    } catch (err) {
        console.warn("Auth Warning:", err.message);
        loadData();
    }
};

// Initial listener
onAuthStateChanged(auth, user => {
    if (user) loadData();
});
