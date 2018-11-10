import React from 'react'

export const Upload = () => {
  return (
    <div className='upload'>
      <form action="/api/sounds" method="post" encType="multipart/form-data">
        <input type="file" name="soundFile" />
        <br />
        <button type="submit" className="btn">
          Submit
        </button>
      </form>
    </div>
  )
}
