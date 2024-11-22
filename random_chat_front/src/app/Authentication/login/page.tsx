'use server'

import Login from "./Login"

export default  async function Authenticated() : Promise<JSX.Element> {
    return (
        <Login />
    );
}