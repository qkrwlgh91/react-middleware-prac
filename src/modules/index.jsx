import { combineReducers } from 'redux';
import counter, {counterSaga} from './counter';
import posts from './posts';
import { all } from 'redux-saga/effects';

const rootReducer = combineReducers({ counter, posts });
export function* rootSaga() {
    yield all([counterSaga()]); // all 은 배열 안의 여러 사가를 동시에 실행시켜준다.
}

export default rootReducer;