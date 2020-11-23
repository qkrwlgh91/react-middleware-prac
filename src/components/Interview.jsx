import React from 'react'

function Interview({ interview }) {
    const { title, answer } = interview;
    return (
        <div>
            <h1>{title}</h1>
            <p>{answer}</p>
        </div>
    )
}

export default Interview;
