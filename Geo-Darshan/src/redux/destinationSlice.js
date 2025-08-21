import { createSlice } from "@reduxjs/toolkit";
import { auth, db } from "../firebase";
import { doc, updateDoc, arrayUnion, arrayRemove } from "firebase/firestore";

const initialState = {
  recommendations: [],
  favorites: [],
  comparisonList: [],
  trending: [],
  itineraryList: [],
};

const destinationSlice = createSlice({
  name: "destination",
  initialState,
  reducers: {
    setRecommendations: (state, action) => {
      state.recommendations = action.payload;
    },
    setFavorites: (state, action) => {
      state.favorites = action.payload;
    },
    addToFavorites: (state, action) => {
      state.favorites.push(action.payload);
    },
    removeFromFavorites: (state, action) => {
      state.favorites = state.favorites.filter((id) => id !== action.payload);
    },
    setComparisonList: (state, action) => {
      state.comparisonList = action.payload;
    },
    setItineraryList: (state, action) => {
      state.itineraryList = action.payload;
    },

    setTrending: (state, action) => {
      state.trending = action.payload;
    },
    addToComparison: (state, action) => {
      if (
        !state.comparisonList.includes(action.payload) &&
        state.comparisonList.length < 3
      ) {
        state.comparisonList.push(action.payload);
      }
    },
    removeFromComparison: (state, action) => {
      state.comparisonList = state.comparisonList.filter(
        (id) => id !== action.payload
      );
    },
    clearComparison: (state) => {
      state.comparisonList = [];
    },
    addToItinerary: (state, action) => {
      if (!state.itineraryList.includes(action.payload)) {
        state.itineraryList.push(action.payload);

        const user = auth.currentUser;
        if (user) {
          const userRef = doc(db, "users", user.uid);
          updateDoc(userRef, {
            itinerary: arrayUnion(action.payload),
          });
        }
      }
    },
    removeFromItinerary: (state, action) => {
      state.itineraryList = state.itineraryList.filter(
        (id) => id !== action.payload
      );

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          itinerary: arrayRemove(action.payload),
        });
      }
    },
    clearItinerary: (state) => {
      state.itineraryList = [];

      const user = auth.currentUser;
      if (user) {
        const userRef = doc(db, "users", user.uid);
        updateDoc(userRef, {
          itinerary: [],
        });
      }
    },
  },
});

export const {
  setRecommendations,
  addToFavorites,
  addToComparison,
  removeFromComparison,
  clearComparison,
  removeFromFavorites,
  setFavorites,
  setTrending,
  addToItinerary,
    removeFromItinerary,
    clearItinerary,
    setComparisonList,
    setItineraryList,
  } = destinationSlice.actions;
  export default destinationSlice.reducer;
