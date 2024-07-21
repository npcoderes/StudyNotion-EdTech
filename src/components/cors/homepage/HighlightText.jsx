import React from 'react'

const HighlightText = ({text,color}) => {
  return (
    <span className={`font-bold  ${color ? color:"gradient-custom"}`}>
        {" "}
        {text}
    </span>
  )
}

export default HighlightText
