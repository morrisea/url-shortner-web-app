import { useState } from 'react'
import './App.css'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <>
      <NavBar title='Short' svg='/icons.svg#url-icon' />
      <h1 id='center' >Hello, world!</h1>
    </>
  )
}

