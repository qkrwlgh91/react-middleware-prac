import * as interviewsAPI from '../api/interviews'; // api/interviews의 안의 함수(axios) 모두 불러옴

// 모듈 리팩토링
import {
    reducerUtils,
    handleAsyncActions,
    createPromiseSaga,
    createPromiseSagaById,
    handleAsyncActionsById
} from '../lib/asyncUtils';

// redux-saga
import { call, put, takeEvery, getContext } from 'redux-saga/effects';

//* 액션 타입 */

// interview list 조회
const GET_INTERVIEWS = 'GET_INTERVIEWS'; // 요청 시작
const GET_INTERVIEWS_SUCCESS = 'GET_INTERVIEWS_SUCCESS'; // 요청 성공
const GET_INTERVIEWS_ERROR = 'GET_INTERVIEWS_ERROR'; // 요청 실패

// interview 하나 조회하기
const GET_INTERVIEW = 'GET_INTERVIEW';
const GET_INTERVIEW_SUCCESS = 'GET_INTERVIEW_SUCCESS';
const GET_INTERVIEW_ERROR = 'GET_INTERVIEW_ERROR';

export const getInterviews = () => ({ type: GET_INTERVIEWS });
export const getInterview = id => ({ type: GET_INTERVIEW, payload: id, meta: id });

const getInterviewsSaga = createPromiseSaga(GET_INTERVIEWS, interviewsAPI.getInterviews);
const getInterviewSaga = createPromiseSagaById(GET_INTERVIEW, interviewsAPI.getInterviewById);

// saga 합치기
export function* interviewsSaga() {
    yield takeEvery(GET_INTERVIEWS, getInterviewsSaga);
    yield takeEvery(GET_INTERVIEW, getInterviewSaga);
};

const initialState = {
    interviews: reducerUtils.initial(),
    interview: reducerUtils.initial()
};

export default function interviews(state = initialState, action) {
    switch(action.type) {
        case GET_INTERVIEWS:
        case GET_INTERVIEWS_SUCCESS:
        case GET_INTERVIEWS_ERROR:
            return handleAsyncActions(GET_INTERVIEWS, 'interviews', true)(state, action);
        case GET_INTERVIEW:
        case GET_INTERVIEW_SUCCESS:
        case GET_INTERVIEW_ERROR:
            return handleAsyncActionsById(GET_INTERVIEW, 'interview',true)(state, action)
        default:
            return state;
    }
    
}