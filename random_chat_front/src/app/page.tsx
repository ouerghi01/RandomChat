import NavBar_new from "./Components/Nav";
import  './globals.css';

import { enableMapSet } from 'immer';
enableMapSet();
export default function Home() {
  return (
    <div  >
      <NavBar_new/>
      
    </div>
  );
}
