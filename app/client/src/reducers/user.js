const initialState = {

};

module.exports = (state = initialState, action) => {
  switch(action.type) {
    case 'EXAMPLE':
      return Object.assign(state, action.data);
    default:
      return state;
  }
};