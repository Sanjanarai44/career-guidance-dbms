import React, { createContext, useContext, useReducer } from 'react';

// Initial state
const initialState = {
  user: {
    name: 'Student',
    email: 'student@example.com',
    profileCompletion: 40
  },
  skills: [],
  interests: [],
  mentorshipRequests: [],
  goals: [],
  analytics: {
    readinessScore: 65,
    skillGrowth: 42
  }
};

// Actions
const ACTION_TYPES = {
  UPDATE_PROFILE: 'UPDATE_PROFILE',
  ADD_SKILLS: 'ADD_SKILLS',
  ADD_INTERESTS: 'ADD_INTERESTS',
  REQUEST_MENTORSHIP: 'REQUEST_MENTORSHIP',
  ADD_GOAL: 'ADD_GOAL',
  UPDATE_ANALYTICS: 'UPDATE_ANALYTICS'
};

// Reducer
const appReducer = (state, action) => {
  switch (action.type) {
    case ACTION_TYPES.UPDATE_PROFILE:
      return {
        ...state,
        user: { ...state.user, ...action.payload }
      };
    case ACTION_TYPES.ADD_SKILLS:
      return {
        ...state,
        skills: action.payload
      };
    case ACTION_TYPES.ADD_INTERESTS:
      return {
        ...state,
        interests: action.payload
      };
    case ACTION_TYPES.REQUEST_MENTORSHIP:
      return {
        ...state,
        mentorshipRequests: [...state.mentorshipRequests, action.payload]
      };
    case ACTION_TYPES.ADD_GOAL:
      return {
        ...state,
        goals: [...state.goals, action.payload]
      };
    case ACTION_TYPES.UPDATE_ANALYTICS:
      return {
        ...state,
        analytics: { ...state.analytics, ...action.payload }
      };
    default:
      return state;
  }
};

// Create Context
const AppContext = createContext();

// Provider Component
export const AppProvider = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  const actions = {
    updateProfile: (profileData) => {
      dispatch({ type: ACTION_TYPES.UPDATE_PROFILE, payload: profileData });
    },
    addSkills: (skills) => {
      dispatch({ type: ACTION_TYPES.ADD_SKILLS, payload: skills });
      // Update analytics when skills are added
      const newReadinessScore = Math.min(state.analytics.readinessScore + 10, 100);
      dispatch({ 
        type: ACTION_TYPES.UPDATE_ANALYTICS, 
        payload: { 
          readinessScore: newReadinessScore,
          skillGrowth: state.analytics.skillGrowth + 15
        }
      });
    },
    addInterests: (interests) => {
      dispatch({ type: ACTION_TYPES.ADD_INTERESTS, payload: interests });
    },
    requestMentorship: (requestData) => {
      const newRequest = {
        id: Date.now(),
        ...requestData,
        status: 'pending',
        date: new Date().toISOString().split('T')[0]
      };
      dispatch({ type: ACTION_TYPES.REQUEST_MENTORSHIP, payload: newRequest });
    },
    addGoal: (goalData) => {
      const newGoal = {
        id: Date.now(),
        ...goalData,
        progress: 0
      };
      dispatch({ type: ACTION_TYPES.ADD_GOAL, payload: newGoal });
    },
    updateGoalProgress: (goalId, progress) => {
      const updatedGoals = state.goals.map(goal =>
        goal.id === goalId ? { ...goal, progress } : goal
      );
      dispatch({ type: ACTION_TYPES.ADD_GOAL, payload: updatedGoals });
    }
  };

  return (
    <AppContext.Provider value={{ state, actions }}>
      {children}
    </AppContext.Provider>
  );
};

// Custom Hook
export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};