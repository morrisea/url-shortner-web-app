import { useState } from 'react'
import './App.css'
import AuthForm from './components/AuthForm'
import NavBar from './components/NavBar'

export default function App() {
  return (
    <>
      <NavBar title="Short" svg="/icons.svg#url-icon" />
      <AuthForm />
    </>
  )
}

