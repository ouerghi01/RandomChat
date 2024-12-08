'use server';
export default async function Authentication(): Promise<JSX.Element> {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            height: '100vh',
            gap: '10px'
        }}>
            
            <h1>Authentication</h1>
           
            <a href="Authentication/login">Login</a>
            <a href="Authentication/register">Register</a>
        </div>
    )

}