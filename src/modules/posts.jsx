import * as postsAPI from '../api/posts'; // api/posts 안의 함수 모두 불러오기

// 프로미스를 다루는 리덕스 모듈을 다룰 때 고려해야할 사항
/*
    1. 프로미스가 시작, 성공, 실패했을때 다른 액션을 디스패치해야함
    2. 각 프로미스마다 thunk함수를 만들어주어야함
    3. 리듀서에서 액션에 따라 로딩중, 결과 ,에러 상태를 변경해주어야함
*/

// 모듈 리팩토링
import { createPromiseThunk, reducerUtils } from '../lib/asyncUtils';

/* 액션타입 */

// 포스트 여러개 조회하기
const GET_POSTS = 'GET_POSTS'; // 요청 시작
const GET_POSTS_SUCCESS = 'GET_POSTS_SUCCESS'; // 요청성공
const GET_POSTS_ERROR = 'GET_POSTS_ERROR'; // 요청 실패

// 포스트 하나 조회하기
const GET_POST = 'GET_POST';
const GET_POST_SUCCESS = 'GET_POST_SUCCESS'; 
const GET_POST_ERROR = 'GET_POST_ERROR';

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
 // 리펙토리를 사용한 thunk 함수
 export const getPosts = createPromiseThunk(GET_POSTS, postsAPI.getPOSTS);
 export const getPost = createPromiseThunk(GET_POST, postsAPI.getPostById);

// initialState도 initial() 함수를 사용하여 리팩토링
const initialState = {
    posts: reducerUtils.initial(),
    post: reducerUtils.initial()
}

export default function posts(state = initialState, action) {
    switch (action.type) {
        case GET_POSTS:
            return {
                ...state,
                posts: reducerUtils.loading()
            }
        case GET_POSTS_SUCCESS:
            return {
                ...state,
                posts: reducerUtils.success(action.payload)
            }
        case GET_POSTS_ERROR:
            return {
                ...state,
                posts: reducerUtils.error(action.error)
            }
        case GET_POST:
            return {
                ...state,
                post: reducerUtils.loading()
            }
            case GET_POST_SUCCESS:
                return {
                    ...state,
                    post: reducerUtils.success(action.payload)
                };
            case GET_POST_ERROR:
                return {
                    ...state,
                    post: reducerUtils.error(action.error)
                };
            default:
                return state;
    }
}