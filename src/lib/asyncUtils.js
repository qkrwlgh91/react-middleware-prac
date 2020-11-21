// Promise에 기반한 Thunk를 만들어 주는 함수
/*
export const createPromiseThunk = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];

    // 이 함수는 promiseCreator가 단 하나의 파라미터만 받는다는 전제하에 작성되었음
    // 만약 여러 종류의 파라미터를 전달해야하는 상황에서는 객체 타입의 파라미터를 받아오도록 하면 됨
    // 예: writeComment({postId: 1, text: '댓글내용' });

    return param => async dispatch => {
        // 요청 시작
        dispatch({ type, param });
        try {
            // 결고물의 이름을 payload라는 이름으로 통일시킴
            const payload = await promiseCreator(param);
            dispatch({ type: SUCCESS, payload }); //성공
        } catch (e) {
            dispatch({ type: ERROR, payload: e, error: true }); // 실패
        }
    }

};
*/
// 사가를 통해서 비동기 작업을 처리 할 때에는 API함수의 인자는 액션에서부터 참조한다.
// 액션 객체에서 사용할 함수의 인자의 이름은 payload로 통일
// 특정 id를 위한 비동기작업을 처리하는 creatrPromiseSagaByID와 handleAsyncActionsByID 에서는 id 값을 action.meta 에서 참조

import { call, put } from 'redux-saga/effects';

// 복잡하고 까다로운 사가 함수를 만들게 될 때에는 사가 함수 안에서 여러 종류의 비동기 작업을 할수 있다.
// 하지만 단순히 하나의 API를 요청해서 결과물을 가지고 액션을 디스패치 하는 일이 꽤나 많은데 이것의 로직을 함수화하여 재사용하면 깔끔한 코드로 작성가능
// createPromiseSaga, createPromiseSagaById

// 프로미스를 기다렸다가 결과를 디스패치하는 사가
export const createPromiseSaga = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return function* saga(action) {
        try {
            //  재사용성을 위하여 promiseCreator의 파라미터엔 action.payload 값을 넣도록 설정
            const payload = yield call(promiseCreator, action.payload);
            yield put({ type: SUCCESS, payload });
        } catch (e) {
            yield put({ type: ERROR, error: true, payload: e });
        }
    }
};

// 특정 id의 데이터를 조회하는 용도로 사용하는 사가
// API를 호출 할 때 파라미터는 action.payload 를 넣고,
// id 값을 action.meta 로 설정
export const createPromiseSagaById = (type, promiseCreator) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return function* saga(action) {
        const id = action.meta;
        try {
            const payload = yield call(promiseCreator, action.payload);
            yield put({ type: SUCCESS, payload, meta: id });
        } catch (e) {
            yield put({ type: ERROR, error: e, meta: id });
        }
    }
}


// 리듀서에서 사용 할 수 있는 여러 유틸 함수
export const reducerUtils = {
    // 초기 상태. 초기 data 값은 기본적으로 null이지만 바꿀 수 있음
    initial: (initialData = null) => ({
        loading: false,
        data: initialData,
        error: null
    }),
    // 로딩중 상태. prevState의 경우엔 기본값은 nulldlwlaks
    // 따로 값을 지정하면 null로 바꾸지 않고 다른 값을 유지시킬 수 있음
    loading: (prevState = null) => ({
        loading: true,
        data: prevState,
        error: null
    }),
    // 성공 상태
    success: payload => ({
        loading: false,
        data: payload,
        error: null
    }),
    // 실패 상태
    error: error => ({
        loading: false,
        data: null,
        error: error
    })

};

// 비동기 관련 액션들을 처리하는 리듀서를 만들어줍니다.
// type은 액션의 타입, key는 상태의 key(예: posts, post) 입니다.
// 재로딩 방지 2 keppData가 true가 되면 로딩중에도 데이터를 유지할 수 있도록 수정
// 재로딩 2는 로딩은하지만 로딩중...을 띄우지 않는 것인데 사용자에게 좋은 경험 제공과 뒤로가기를 통해 다시 포스트 목록을 조회할때 최신 데이터를 보여줄수 있다는 장점이 있다.
export const handleAsyncActions = (type, key, keepData = false) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return (state, action) => {
        switch (action.type) {
            case type:
                return {
                    ...state,
                    [key]: reducerUtils.loading(keepData ? state[key].data : null)
                }
            case SUCCESS:
                return {
                    ...state,
                    [key]: reducerUtils.success(action.payload)
                }
            case ERROR:
                return {
                    ...state,
                    [key]: reducerUtils.error(action.payload)
                }
            default:
                return state;
        }
    }
};

// 한페이지의 특정 포스트를 조회할때 재로딩을 방지하려면 asyncUtils에 만든 여러 함수를 커스터마이징 해야하므로, 기존 함수를 수정하는 대신 새로운 함수 작성
// 비동기 작업에 관련된 액션이 어떤 id를 가르키는지 확인하기위해 action.meta 값에 id를 넣어주어야 한다.
/*
// 특정 id를 처리하는 Thunk 생성함수
const defaultIdSelector = param => param;
export const createPromiseThunkById = (
    type,
    promiseCreator,
    //파라미터에서 id를 어떻게 선택할지 정의하는 함수
    // 기본 값으로는 파라미터를 그대로 id로 사용합니다.
    // 하지만 만약 파라미터가 { id: 1, details: true } 이런 형태라면
    // idSelector를 param => param.id 이런식으로 설정 할 수 있음
    idSelector = defaultIdSelector
) => {
    const [SUCCESS, ERROR ] = [`${type}_SUCCESS`, `${type}_ERROR`];

    return param => async dispatch => {
        const id = idSelector(param);
        dispatch({ type, meta: id});
        try {
            const payload = await promiseCreator(param);
            dispatch({ type: SUCCESS, payload, meta: id});
        } catch (e) {
            dispatch({ type: ERROR, error: true, payload: e, meta: id})
        }
    };
};
*/

// id 별로 처리하는 유틸함수
export const handleAsyncActionsById = (type, key, keepData = false) => {
    const [SUCCESS, ERROR] = [`${type}_SUCCESS`, `${type}_ERROR`];
    return (state, action) => {
        const id = action.meta;
        switch (action.type) {
            case type:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id]: reducerUtils.loading (
                            keepData ? state[key][id] && state[key][id].data : null
                        )
                    }
                };
            case SUCCESS:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id]: reducerUtils.success(action.payload)
                    }
                };
            case ERROR:
                return {
                    ...state,
                    [key]: {
                        ...state[key],
                        [id]: reducerUtils.error(action.payload)
                    }
                };
            default:
                return state;
        }
    }
}