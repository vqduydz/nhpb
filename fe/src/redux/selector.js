import jwtDecode from 'jwt-decode';

function globalStates(state) {
    const token = state.auth.token || null;
    const currentUser = state.auth.currentUser ? jwtDecode(state.auth.currentUser) : null;
    const orderItems = state.orderItems.orderItems || null;
    const userID = token ? jwtDecode(token).id : null;
    const language = state.language.language || 'vi';
    return { currentUser, token, language, orderItems, userID };
}

export const selector = { globalStates };
