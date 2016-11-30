const createStore = require('redux').createStore;
const applyMiddleware = require('redux').applyMiddleware;
const thunk = require('redux-thunk').default;
const rootReducer = require('../reducers');


module.exports = initialState => {
  const store = createStore(
    rootReducer, initialState,
    applyMiddleware(thunk));

  if (module.hot) {
    module.hot.accept('../reducers', () => {
      const nextRootReducer = require('../reducers');
      store.replaceReducer(nextRootReducer);
    })
  }

  return store;
};