import React, {useEffect} from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { getInterview, goToHome } from '../modules/interviews';
import Interview from '../components/Interview';


function InterviewContainer({ interviewId }) {

    const { data, loading, error } = useSelector(
        state => state.interviews.interview[interviewId]
    ) || {
        loading: false,
        data: null,
        error: null
    };
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getInterview(interviewId));
    }, [interviewId, dispatch]);

    if (loading && !data) return <div>로딩 중 ...</div>
    if (error) return <div>에러 발생</div>
    if (!data) return null;

    return (
        <>
            <button onClick={() => dispatch(goToHome())}>홈으로</button>
            <Interview interview={data} />
        </>
    )
}

export default InterviewContainer;
