import React from 'react'

function Rating({ value, text, color = '#f8e825' }) {
  return (
    <div className="rating my-2">
      {/* Star 1 */}
      <span>
        <i style={{ color }} className={
          value >= 1 ? 'fas fa-star' : value >= 0.5 ? 'fas fa-star-half-alt' : 'far fa-star'
        }></i>
      </span>
      {/* Star 2 */}
      <span>
        <i style={{ color }} className={
          value >= 2 ? 'fas fa-star' : value >= 1.5 ? 'fas fa-star-half-alt' : 'far fa-star'
        }></i>
      </span>
      {/* Star 3 */}
      <span>
        <i style={{ color }} className={
          value >= 3 ? 'fas fa-star' : value >= 2.5 ? 'fas fa-star-half-alt' : 'far fa-star'
        }></i>
      </span>
      {/* Star 4 */}
      <span>
        <i style={{ color }} className={
          value >= 4 ? 'fas fa-star' : value >= 3.5 ? 'fas fa-star-half-alt' : 'far fa-star'
        }></i>
      </span>
      {/* Star 5 */}
      <span>
        <i style={{ color }} className={
          value >= 5 ? 'fas fa-star' : value >= 4.5 ? 'fas fa-star-half-alt' : 'far fa-star'
        }></i>
      </span>
      
      {/* Number of reviews text (e.g., "12 reviews") */}
      <span className="ms-2">{text && text}</span>
    </div>
  )
}

export default Rating