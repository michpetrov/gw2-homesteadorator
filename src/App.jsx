import { Outlet } from "react-router";
import Navigation from './Navigation.jsx'
import Notice from './Notice.jsx'
import GithubCorner from './GithubCorner.jsx'
import './App.css'

export default () => {

  return (
    <>
    <GithubCorner />
    <div className="content">
      <Notice />
      <h1>GW2 Homesteadorator</h1>
      <Outlet />
      <footer>
        <Navigation />
      </footer>
    </div>
    </>
  )
}