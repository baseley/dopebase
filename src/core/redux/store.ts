import { createStore, applyMiddleware, compose } from "redux";
import { thunk } from "redux-thunk";
import rootReducer from "./reducers";

export interface ReduxRootState {
  auth: {
    user: any;
    loading: boolean;
    errors: null | any;
  };
}

const initialState: Partial<ReduxRootState> = {};
const middleware = [thunk];

const store = createStore(
  rootReducer,
  initialState,
  applyMiddleware(...middleware)
  // compose(
  //     applyMiddleware(...middleware),
  //     window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  // )
);

export default store;
