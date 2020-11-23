import { combineReducers } from 'redux';
import counter, {counterSaga} from './counter';
import posts, { postsSaga } from './posts';
import interviews, { interviewsSaga} from './interviews';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({ counter, posts, interviews });
export function* rootSaga() {
    yield all([counterSaga(), postsSaga(), interviewsSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜준다.
}

export default rootReducer;