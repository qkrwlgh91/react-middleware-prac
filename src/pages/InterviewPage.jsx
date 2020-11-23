import React from 'react';
import InterviewContainer from '../containers/InterviewContainer';

function InterviewPage({ match }) {
    const { id } = match.params; // URL 파라미터 조회

    // URL 파라미터 값은 문자열이기 때문에 parseInt를 사용해서 숫자로 변환)
    return (
        <InterviewContainer interviewId={parseInt(id, 10)} />
    )
}

export default InterviewPage;
