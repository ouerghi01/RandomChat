import React from 'react'
import Logout from './Components/logout'

export default function MessageApp() {
  return (
    <div className='container'>
      <header >
      <nav >
        <Logout/>
      </nav>
      </header>
     
      <main style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: '20px',
        
      }} >
        in Development
      </main>
    
    </div>
  )
}
