import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기

// 프로미스를 다루는 리덕스 모듈을 다룰 때 고려해야할 사항
/*
    1. 프로미스가 시작, 성공, 실패했을때 다른 액션을 디스패치해야함
    2. 각 프로미스마다 thunk함수를 만들어주어야함
    3. 리듀서에서 액션에 따라 로딩중, 결과 ,에러 상태를 변경해주어야함
*/

// 모듈 리팩토링
import { 
    createPromiseThunk, 
    reducerUtils, 
    handleAsyncActions, 
    createPromiseThunkById, 
    handleAsyncActionsById,
    createPromiseSaga,
    createPromiseSagaById
} from '../lib/asyncUtils';

// redux-saga
import { call, put, takeEvery } from 'redux-saga/effects';

/* 액션타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS'; 
const GET_POST_ERROR = 'GET_POST_ERROR';

// 포스트 비우기
// 특정 포스트를 조회할때는 어떤 파라미터가 주어졌냐에 따라 결과물이 다르기 때문에 재로딩 문제를 해결하기 위한 첫번째 방법으로 포스트 내용을 비워주어야 한다.
const CLEAR_POST = 'CLEAR_POST';

/*
// thunk를 사용 할 때, 꼭 모든 액션들에 대하여 액션 생성함수를 만들 필요는 없음
// 그냥 thunk 함수에서 바로 액션 객체를 만들어주어도 괜찮음

export const getPosts = () => async dispatch => {
    dispatch({ type: GET_POSTS }); // 요청이 시작됨
    try {
        const posts = await postsAPI.getPosts(); // API 호출
        dispatch({ type: GET_POSTS_SUCCESS, posts }); // 성공
    } catch (e) {
        dispatch({ type: GET_POSTS_ERROR, error: e }); //실패
    }
};

// thunk 함수에서도 파라미터를 받아와서 사용할 수 있음
export const getPost = id => async dispatch => {
    dispatch({ type: GET_POST }); // 요청이 시작됨
    try {
        const post = await postsAPI.getPostById(id); // API 호출
        dispatch({ type: GET_POST_SUCCESS, post }); // 성공
    } catch (e) {
        dispatch({ type: GET_POST_ERROR, error: e}); //실패
    }
};

const initialState = {
    posts: {
        loading: false,
        data: null,
        error: null
    },
    post: {
        loading: false,
        data: null,
        error: null
    }
};

*/

/*
 // 리펙토리를 사용한 thunk 함수
 export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPosts);
 export const getPost = createPromiseThunkById(GET_POST, postsAPI.getPostById);

 // export const clearPost = () => ({ type: CLEAR_POST });

// initialState도 initial() 함수를 사용하여 리팩토링
const initialState = {
    posts: reducerUtils.initial(),
    //post: reducerUtils.initial()
    post: {}
}
*/

// redux-saga 사용
/*
    redux-thunk를 사용할때는 thunk함수를 사용해야 했지만 redux-saga를 사용하면 순수 액션 객체를 반환하는 액션 생성함수로 구현할 수 있다.
    액션을 모니터링해서 특정 액션이 발생했을 때 호출할 사가 함수에서는 파라미터로 해당 액션을 받아올 수 있음
    그렇기 때문에 getPostSaga의 경우 액션을 파라미터로 받아와 해당 액션의 id값을 참조할 수 있음
    예 )
    dispatch({ type: GET_POST, payload: 1, meta: 1}) 이란 코드가 실행되면,
    액션에서 action.payload 값을 추출하여 API를 호출 할 때 인자로 넣어서 호출
    meta는 handleAsynActionById를 호환하기 위함으로 사용하지 않는다면 meta를 생략해도 됨
*/

export const getPosts = () => ({ type: GET_POSTS });
// payload는 파라미터 용도, meta는 리듀서에서 id를 알기위한 용도
export const getPost = id => ({ type: GET_POST, payload: id, meta: id });

/*
function* getPostsSaga() {
    try {
        const posts = yield call(postsAPI.getPosts); // call을 사용하면 특정 함수를 호출하고, 결과물이 반환될 때까지 기다려 줄 수 있음
        yield put({
            type: GET_POSTS_SUCCESS,
            payload: posts
        }); // 성공 액션 디스패치
    } catch (e) {
        yield put({
            type: GET_POSTS_ERROR,
            error: true,
            paylaod: e
        }); // 실패 액션 디스패치
    }
}

// 액션이 지니고 있는 값을 조회하고 싶다면 action을 파라미터로 받아와서 사용
function* getPostSaga(action) {
    const param = action.payload;
    const id = action.meta;
    try {
        const post = yield call(postsAPI.getPostById, param); // API 함수에 넣어주고 싶은 인자는 call 함수의 두번째 인자부터 순서대로 넣어주면 됨
        yield put({
            type: GET_POST_SUCCESS,
            payload: post,
            meta: id
        })
    } catch (e) {
        yield put({
            type: GET_POST_ERROR,
            error: true,
            payload: e,
            meta: id
        })
    }
}
*/

const getPostsSaga = createPromiseSaga(GET_POSTS, postsAPI.getPosts);
const getPostSaga = createPromiseSagaById(GET_POST, postsAPI.getPostById);

// 사가들을 합치기
export function* postsSaga() {
    yield takeEvery(GET_POSTS, getPostsSaga);
    yield takeEvery(GET_POST, getPostSaga);
}

const initialState = {
    posts: reducerUtils.initial(),
    post: reducerUtils.initial()
}

export default function posts(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
        case GET_POSTS_SUCCESS:
        case GET_POSTS_ERROR:
            return handleAsyncActions(GET_POSTS, 'posts', true)(state, action);
        case GET_POST:
        case GET_POST_SUCCESS:
        case GET_POST_ERROR:
            return handleAsyncActionsById(GET_POST, 'post', true)(state, action);
        // case CLEAR_POST:
        //     return {
        //         ...state,
        //         post: reducerUtils.initial()
        //     }
        default:
            return state;
    }
}

/* 
    return handleAsyncActions(GET_POSTS, 'posts')(state, action); 는

    const postsReducer = handleAsyncActions(GET_POSTS, 'posts');
    return postsReducer(state, action);

    과 같이 작성할 수 있다.
*/

// 홈화면으로 이동하는 Thunk
// 3번째 인자를 사용하면 index.js의 withExtraArgument에서 넣어준 값들을 사용할 수 있음
// containers/PostContainer.jsx에서 아래 함수를 dispatch
// 현재는 단순히 바로 홈으로 이동하게끔 함수를 작성했지만, getState()를 사용하여 현재 리덕스 스토어의 상태를 확인하여 조건부로 이동을 하거나, 특정 API를 호출하여 성공했을 시에만 이동하는 방식으로 구현할 수 있다.
export const goToHome = () => ( dispatch, getState, { history }) => {
    history.push('/');
}