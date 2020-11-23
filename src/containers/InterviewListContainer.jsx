import React, {useEffect} from 'react';
import { useSelector, useDispatch} from 'react-redux';
import InterviewList from '../components/InterviewList';
import { getInterviews } from '../modules/interviews';

function InterviewListContainer() {
    const { data, loading, error } = useSelector(state => state.interviews.interviews);
    const dispatch = useDispatch();

    // 컴포넌트 마운트 후 포스트 목록 요청
    useEffect(() => {
        dispatch(getInterviews());
    },[dispatch]);

    if(loading && !data) return <div>로딩 중...</div>
    if(error) return <div>에러 발생!!!</div>
    if(!data) return null;

    return (
        <InterviewList interviews={data} />
    )
}

export default InterviewListContainer;
