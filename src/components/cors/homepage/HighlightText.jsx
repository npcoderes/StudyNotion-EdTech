import React from 'react'

const HighlightText = ({text,color}) => {
  return (
    <span className={`font-bold  ${color}`}>
        {" "}
        {text}
    </span>
  )
}

export default HighlightText
