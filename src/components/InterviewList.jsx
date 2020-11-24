import React from 'react';
import { Link } from 'react-router-dom';

function InterviewList({ interviews }) {
    return (
        <ul>
            {interviews.map(interview => (
                <li key={interview.id}>
                    <Link to={`/interviews/${interview.id}`}>{interview.title}</Link>
                </li>
            ))}
        </ul>
    )
}

export default InterviewList;